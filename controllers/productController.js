const Product = require("../model/productSchema");
const User = require("../model/userSchema");
const Order = require('../model/orderSchema')
const { Storage } = require("@google-cloud/storage");
const R2 = require("../config/r2");
const {PutObjectCommand} = require("@aws-sdk/client-s3");

const getAllProducts= async (req, res)=>{
    const allProducts= await Product.find();
    const productsWithoutId = allProducts.map(product => {
        const { _id, ...productWithoutId } = product.toObject();
        return productWithoutId;
    });
    res.send(res.addAssetUrl(productsWithoutId));
}
const getProducts= async (req,res)=>{
    try{
        const {sortingOrder, priceRange, searchText, category, subCategory,availability}=req.query
        let query={}
        if(priceRange){
            const [minPrice, maxPrice]=priceRange.split('-')
            query.price={$gte: minPrice, $lte:maxPrice}
        }
        if(searchText) {
            query.$or = [
                { name: { $regex: searchText, $options: 'i' } },
                { category: { $regex: searchText, $options: 'i' } }
            ];
        }
        if(category) {
            query.category = category;
        }
        if(subCategory){
            query.subCategory=subCategory
        }
        if(availability){
            query.availability=availability
        }
        let productsQuery=Product.find(query)
        if(sortingOrder){
            const [sortField, sortOrder] = sortingOrder.split(':');
            const sortObject = { [sortField]: parseInt(sortOrder) };
            productsQuery = productsQuery.sort(sortObject);
        }
        const products = await productsQuery;
        res.status(200).json(res.addAssetUrl(products));
    }catch (error){
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}
const getProductsByPagination= async (req,res)=>{
    try{
        const {sortingOrder, priceRange, searchText, category, subCategory,availability}=req.query
        const page=parseInt(req.query.page) || 1
        const pageSize =parseInt(req.query.pageSize) || 5

        let query={}
        if(priceRange){
            const [minPrice, maxPrice]=priceRange.split('-')
            query.price={$gte: minPrice, $lte:maxPrice}
        }
        if(searchText) {
            query.$or = [
                { name: { $regex: searchText, $options: 'i' } },
                { category: { $regex: searchText, $options: 'i' } }
            ];
        }
        if(category) {
            query.category = category;
        }
        if(subCategory){
            query.subCategory=subCategory
        }
        if(availability){
            query.availability=availability
        }
        let productsQuery=Product.find(query)
        if(sortingOrder){
            const [sortField, sortOrder] = sortingOrder.split(':');
            const sortObject = { [sortField]: parseInt(sortOrder) };
            productsQuery = productsQuery.sort(sortObject);
        }

        const totalProducts =await Product.countDocuments(query);
        const totalPages =Math.ceil(totalProducts/pageSize)

        const paginatedProducts= await productsQuery
            .skip((page-1)*pageSize)
            .limit(pageSize)

        const paginatedProductsWithoutId = paginatedProducts.map(product => {
            const { _id, ...productWithoutId } = product.toObject(); // Convert Mongoose document to plain JavaScript object
            return productWithoutId;
        });
        res.status(200).json({
            totalProducts,
            totalPages,
            currentPage: page,
            products: res.addAssetUrl(paginatedProductsWithoutId)
        });
    }catch (error){
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}
const getProductById=async (req, res)=>{
    const productId = req.params.id;
    const product=await Product.findOne({productId: productId})
        .populate({
            path:'reviews.user',
            select:'name'
        })
    if(product && product.reviews){
        product.reviews.sort((a,b)=>{
            const aHasImages = a.images && a.images.length > 0;
            const bHasImages = b.images && b.images.length > 0;

            if (aHasImages && !bHasImages) {
                return -1;
            } else if (!aHasImages && bHasImages) {
                return 1;
            }
            return b.rating-a.rating
        })
    }
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    return res.status(200).json(res.addAssetUrl(product))
}

const getProductsByCategory=async (req, res)=>{
    const category = req.params.category;
    Product.find({category:category})
        .then(product=>{
            if(!product){return res.status((404)).end()}
            return res.status(200).json(res.addAssetUrl(product))
        })
}

const getProductsBySubCategory=async (req, res)=>{
    const category = req.params.category;
    const subCategory = req.params.subCategory;
    Product.find({category:category, subCategory:subCategory})
        .then(product=>{
            if(!product){return res.status((404)).end()}
            return res.status(200).json(res.addAssetUrl(product))
        })
}

const addProduct= async (req, res)=>{
    const {name, category, subCategory, imageLinks, price,quantity, availability, about}=req.body;
    if(!name || !category || !subCategory || !price || !availability || !quantity || !about){
        return res.status(422).json({error :'Products details not provided'})
    }
    const user=await User.findById(req.user._id)
    const artistName=user.name
    Product.findOne({name:name, category: category, subCategory:subCategory})
        .then((productExist)=>{
            if(productExist){
                return res.status(409).json({error :'Product already exists'})
            }
            const product= new Product({artistName, name, category, subCategory, imageLinks, price, quantity, availability, about})
            product.save().then(()=>{
                res.status(201).json({message: 'Product added successfully'});
            }).catch((error)=>{
                res.status(500).json({error:'Product could not be added'})
            })
        }).catch(err=>{
        console.error(err)
    })
}

let projectId = process.env.GOOGLE_CLOUD_PROJECT_ID; // Get this from Google Cloud
let keyFilename = process.env.GOOGLE_CLOUD_KEYFILE_PATH; // Get this from Google Cloud -> Credentials -> Service Accounts
const storage = new Storage({
    projectId,
    keyFilename,
});
const bucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME); // Get this from Google Cloud -> Storage

const addProductImages = async (req, res) => {
    try {
        const productId = req.body.productId;
        const product = await Product.findOne({ productId });

        if (!product) {
            return res.status(400).json({ message: 'Product not found' });
        }

        const category = product.category.toLowerCase().replaceAll(/\s+/g, '-');
        const subCategory = product.subCategory.toLowerCase().replaceAll(/\s+/g, '-');

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files found' });
        }

        let uploadFailed = false;

        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];
            const ext = file.originalname.split('.').pop().toLowerCase();

            const filename = `${i}.${ext}`;

            const filePath = `navkarArtistryHub/products/${category}/${subCategory}/${productId}/${filename}`;

            await R2.client.send(new PutObjectCommand({
                Bucket: R2.BUCKET,
                Key: filePath,
                Body: file.buffer,
                ContentType: file.mimetype,
            }));

            const imageLink = `${R2.PUBLIC_URL}/${filePath}`;
            product.imageLinks.push(imageLink);
        }

        await product.save();

        res.status(201).json({ message: 'Images added successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteProductImage= async (req,res)=>{
    try{
        const {imageUrl, productId}=req.body
        const parts=imageUrl.split('/')
        parts.splice(0,3)
        const filePathName=parts.join('/')
        await bucket.file(filePathName).delete()
        let product= await Product.findOne({productId: productId})
        let i =product.imageLinks.indexOf(imageUrl)
        product.imageLinks.splice(i, 1)
        await product.save()
        res.status(201).json({message: 'Product Image Removed Successfully'})
    } catch (error){
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

const defaultProductImage= async (req, res)=>{
    try{
        const {productId, defaultImageUrl}=req.body
        let product= await Product.findOne({productId: productId})
        if(product){
            let i=product.imageLinks.indexOf(defaultImageUrl)
            if(i>=0){
                const tempUrl=product.imageLinks[0]
                product.imageLinks[0]=product.imageLinks[i]
                product.imageLinks[i]=tempUrl
            }
        }
        await product.save()
        res.status(201).json({message: 'Successfully Updated Default Image'})
    } catch (error){
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

const updateProduct= async (req, res)=>{
    try{
        const {name, category, subCategory , price,quantity, availability, about}=req.body;
        if(!name || !category || !subCategory || !price || !quantity || !availability){
            return res.status(422).json({error :'Products details not provided'})
        }
        let product=await Product.findOne({productId: req.body.productId})
        if(!product){
            return res.status(404).json({ error: 'Product not found' });
        }
        product.name = name;
        product.category = category;
        product.subCategory = subCategory;
        product.price = price;
        product.quantity = quantity;
        product.availability = availability;
        product.about = about;

        await product.save()
        res.status(200).json({ message: 'Product updated successfully', product: product });
    } catch (error){
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

const deleteProduct= async (req,res)=>{
    try{
        const productId=req.params.productId
        await Product.deleteOne({productId: productId})
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error){
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

const addReview= async (req,res)=>{
    try{
        let product= await Product.findOne({productId: req.body.productId})
        if(product){
            const user= await User.findById(req.user._id)
            const orderDetails=await Order.exists({userId: user.userId, 'orderDetails.product': product._id})
            let verifiedPurchase=false
            if(orderDetails){
                verifiedPurchase=true
            }
            let review={
                title: req.body.title,
                writtenReview: req.body.writtenReview,
                rating: Number(req.body.rating),
                user: req.user._id,
                verifiedPurchase: verifiedPurchase,
                images: []
            }

            const name = product.name.toLowerCase().replace(/\s+/g, '-');
            const category = product.category.toLowerCase().replace(/\s+/g, '-');
            const subCategory = product.subCategory.toLowerCase().replace(/\s+/g, '-');
            if (req.files.length!==0) {
                let uploadFailed = false;
                for (const file of req.files) {
                    const filePath = `/reviews/${category}/${subCategory}/${name}/${file.originalname}`;
                    const blob = bucket.file(filePath);
                    const blobStream = blob.createWriteStream();
                    await new Promise((resolve, reject) => {
                        blobStream.on("error", (err) => {
                            uploadFailed = true;
                            reject(err);
                        });
                        blobStream.on("finish", () => {
                            const imageLink = link + filePath;
                            review.images.push(imageLink);
                            resolve();
                        });
                        blobStream.end(file.buffer);
                    });
                }
                if (uploadFailed) {
                    res.status(500).json({ message: 'Some files failed to upload' });
                }
            }
            const productRating=product.reviews.length*product.rating
            product.reviews.push(review)
            product.rating = (productRating + review.rating) / product.reviews.length

            await product.save()
            res.status(201).json({ message: 'Review added successfully' });
        }
        else{
            res.status(400).json({ message: 'Product not found'})
        }
    } catch (error){
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

module.exports={
    getAllProducts,
    getProducts,
    getProductsByPagination,
    getProductsByCategory,
    getProductsBySubCategory,
    getProductById,
    addProduct,
    addProductImages,
    deleteProductImage,
    defaultProductImage,
    updateProduct,
    deleteProduct,
    addReview,
}
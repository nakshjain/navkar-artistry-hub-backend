const Product = require("../model/productSchema");
const { Storage } = require("@google-cloud/storage");

const getAllProducts= async (req, res)=>{
    const allProducts= await Product.find();
    const productsWithoutId = allProducts.map(product => {
        const { _id, ...productWithoutId } = product.toObject();
        return productWithoutId;
    });
    res.send(productsWithoutId);
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
        res.status(200).json(products);
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
            products: paginatedProductsWithoutId
        });
    }catch (error){
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}
const getProductById=async (req, res)=>{
    const productId = req.params.id;
    const product=await Product.findOne({productId: productId})
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    return res.status(200).json(product)
}
const getProductsByCategory=async (req, res)=>{
    const category = req.params.category;
    const products= Product.find({category:category})
        .then(product=>{
            if(!product){return res.status((404)).end()}
            return res.status(200).json(product)
        })
}

const addProduct=(req, res)=>{
    const {name, category, subCategory, imageLinks, price,quantity, availability, about}=req.body;
    if(!name || !category || !subCategory || !price || !availability || !quantity || !about){
        return res.status(422).json({error :'Products details not provided'})
    }

    Product.findOne({name:name, category: category, subCategory:subCategory})
        .then((productExist)=>{
            if(productExist){
                return res.status(422).json({error :'Product already exists'})
            }
            const product= new Product({name, category, subCategory, imageLinks, price, quantity, availability, about})
            product.save().then(()=>{
                res.status(201).json({message: 'Product added successfully'});
            }).catch((error)=>{
                res.status(500).json({error:'Product could not be added'})
            })
        }).catch(err=>{
        console.error(err)
    })
}

let projectId = process.env.PROJECT_ID; // Get this from Google Cloud
let keyFilename = process.env.GOOGLE_CLOUD_KEYFILE_PATH; // Get this from Google Cloud -> Credentials -> Service Accounts
const storage = new Storage({
    projectId,
    keyFilename,
});
const bucket = storage.bucket(process.env.BUCKET); // Get this from Google Cloud -> Storage

const addProductImages = async (req, res) => {
    try {
        const name = req.body.name;
        const productId = req.body.productId;
        console.log(process.env.BUCKET)

        let product=await Product.findOne({productId: productId})
        if(product){
            const category = product.category.toLowerCase().replace(/\s+/g, '-');
            const subCategory = product.subCategory.toLowerCase().replace(/\s+/g, '-');
            const link=`https://assets.navkarartistryhub.com/`
            if (req.files.length!==0) {
                let uploadFailed = false;
                for (const file of req.files) {
                    const filePath = `${category}/${subCategory}/${file.originalname}`;
                    const blob = bucket.file(filePath);
                    const blobStream = blob.createWriteStream();
                    await new Promise((resolve, reject) => {
                        blobStream.on("error", (err) => {
                            uploadFailed = true;
                            reject(err);
                        });
                        blobStream.on("finish", () => {
                            const imageLink = link + filePath;
                            product.imageLinks.push(imageLink);
                            resolve();
                        });
                        blobStream.end(file.buffer);
                    });
                }
                if (uploadFailed) {
                    res.status(500).json({ message: 'Some files failed to upload' });
                } else {
                    await product.save()
                    res.status(201).json({ message: 'Images added successfully' });
                }
            } else {
                res.status(400).json({ message: 'No files found in the request' });
            }
        }
        else{
            res.status(400).json({ message: 'Product not found'})
        }
    } catch (error) {
        console.error("Error:", error);
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
        const {name, category, subCategory, imageLinks, price,quantity, availability, about}=req.body;
        if(!name || !category || !subCategory || !imageLinks || !price || !quantity || !availability){
            return res.status(422).json({error :'Products details not provided'})
        }
        let product=await Product.findOne({productId: req.body.productId})
        if(!product){
            return res.status(404).json({ error: 'Product not found' });
        }
        product.name = name;
        product.category = category;
        product.subCategory = subCategory;
        product.imageLinks = imageLinks;
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
        const result=await Product.deleteOne({productId: productId})
        res.status(200).json({ message: 'Product deleted successfully' });
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
    getProductById,
    addProduct,
    addProductImages,
    deleteProductImage,
    defaultProductImage,
    updateProduct,
    deleteProduct
}
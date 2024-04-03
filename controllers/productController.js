const Product = require("../model/productSchema");

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
    if(!name || !category || !imageLinks || !price || !availability){
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
                console.error(error)
                res.status(500).json({error:'Product could not be added'})
            })
        }).catch(err=>{
        console.error(err)
    })
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
    updateProduct,
    deleteProduct
}
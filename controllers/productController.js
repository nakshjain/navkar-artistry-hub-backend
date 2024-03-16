const Product = require("../model/productSchema");

const getAllProducts= async (req, res)=>{
    const allProducts= await Product.find();
    res.send(allProducts);
}
const getProducts= async (req,res)=>{
    try{
        const {sortingOrder, priceRange, searchText, category, subCategory,availability}=req.query
        console.log(req.query)
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
const getProductById=async (req, res)=>{
    const productId = req.params.id;
    const product= Product.findById(productId)
        .then(product=>{
            if(!product){return res.status((404)).end()}
            return res.status(200).json(product)
        })
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
    const {name, category, imageLink, price, availability, about}=req.body;
    if(!name || !category || !imageLink || !price || !availability){
        console.log('Error')
        console.log(req.body)
        return res.status(422).json({error :'Products details not provided'})
    }

    Product.findOne({name:name, category: category})
        .then((productExist)=>{
            if(productExist){
                return res.status(422).json({error :'Product already exists'})
            }
            const product= new Product({name, category, imageLink, price, availability, about})
            product.save().then(()=>{
                res.status(201).json({message: 'Product added successfully'});
            }).catch((err)=>res.status(500).json({error:'Product could not be added'}))
        }).catch(err=>{
        console.log(err)
    })
}
module.exports={
    getAllProducts,
    getProducts,
    getProductsByCategory,
    getProductById,
    addProduct
}
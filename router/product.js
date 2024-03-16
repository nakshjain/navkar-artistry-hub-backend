const express=require('express')
const router=express.Router();
const {getAllProducts,
    getProducts,
    getProductById,
    getProductsByCategory,
    addProduct } = require("../controllers/productController");

router.get('/getAllProducts', getAllProducts)

router.get('/getProducts', getProducts)

router.get('/getProductById/:id', getProductById)

router.get('/getProductsByCategory/:category', getProductsByCategory)

router.post('/addProduct', addProduct)

module.exports=router

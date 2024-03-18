const express=require('express')
const router=express.Router();
const auth=require('../middleware/auth')
const {getAllProducts,
    getProductById,
    getProductsByCategory,
    addProduct, getProductsByPagination
} = require("../controllers/productController");

router.get('/getAllProducts', getAllProducts)

router.get('/getProductsByPagination', getProductsByPagination)

router.get('/getProductById/:id', getProductById)

router.get('/getProductsByCategory/:category', getProductsByCategory)

router.post('/addProduct', auth, addProduct)

module.exports=router

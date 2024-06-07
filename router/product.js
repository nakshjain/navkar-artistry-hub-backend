const express=require('express')
const router=express.Router();
const auth=require('../middleware/auth')
const {getAllProducts,
    getProductById,
    getProductsByCategory,
    getProductsBySubCategory,
    getProductsByPagination,
    addProduct,
    addProductImages,
    deleteProductImage,
    defaultProductImage,
    updateProduct,
    deleteProduct,
    addReview} = require("../controllers/productController");

const multer = require('multer');
const upload = multer();

router.get('/getAllProducts', getAllProducts)

router.get('/getProductsByPagination', getProductsByPagination)

router.get('/getProductById/:id', getProductById)

router.get('/getProductsByCategory/:category', getProductsByCategory)

router.get('/getProductsBySubCategory/:category/:subCategory', getProductsBySubCategory)

router.post('/addProduct', auth, addProduct)

router.post('/addProductImages', upload.array("images", 5), auth, addProductImages)

router.delete('/deleteProductImage', auth, deleteProductImage)

router.put('/defaultProductImage', auth, defaultProductImage)

router.put('/updateProduct', auth, updateProduct)

router.delete('/deleteProduct/:productId', auth, deleteProduct)

router.post('/addReview/:productId', auth, addReview)

module.exports=router

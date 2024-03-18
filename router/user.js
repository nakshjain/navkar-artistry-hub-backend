const express=require('express')
const auth=require('../middleware/auth')
const User=require('../model/userSchema')
const router=express.Router();
const {isAuthenticated, getUserDetails}=require('../controllers/userController')

router.get('/isAuthenticated',auth,isAuthenticated)

router.get('/getUserDetails',auth,getUserDetails)

module.exports=router
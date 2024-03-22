const express=require('express')
const auth=require('../middleware/auth')
const router=express.Router();
const {getUserDetails}=require('../controllers/userController')

router.get('/getUserDetails',auth,getUserDetails)

module.exports=router
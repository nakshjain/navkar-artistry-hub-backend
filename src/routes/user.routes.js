const express=require('express')
const auth=require('../middleware/auth')
const router=express.Router();
const {getUserDetails, updateUserDetails,  addAddress, updateAddress, removeAddress, setDefaultAddress}=require('../controllers/user.controller')

router.get('/getUserDetails',auth,getUserDetails)

router.put('/updateUserDetails',auth,updateUserDetails)

router.post('/addAddress',auth,addAddress)

router.put('/updateAddress',auth,updateAddress)

router.delete('/removeAddress',auth,removeAddress)

router.post('/setDefaultAddress',auth,setDefaultAddress)

module.exports=router
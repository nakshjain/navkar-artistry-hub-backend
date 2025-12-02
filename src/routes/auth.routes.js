const express=require('express')
const router=express.Router();
const {sendOTP, signUp, login, resetPassword, resetPasswordSendOtp, isAuthenticated, isAdmin} = require("../controllers/auth.controller");
const auth = require("../middleware/auth");

router.post('/sendOTP',sendOTP)

router.post('/signUp', signUp)

router.post('/login', login)

router.post('/resetPassword', resetPassword)

router.post('/resetPassword/sendOTP', resetPasswordSendOtp)

router.get('/isAuthenticated',auth,isAuthenticated)

router.get('/isAdmin',auth,isAdmin)

module.exports=router
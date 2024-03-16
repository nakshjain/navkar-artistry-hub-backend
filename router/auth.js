const express=require('express')
const router=express.Router();
const {sendOTP, signUp, login} = require("../controllers/authController");

router.post('/sendOTP',sendOTP)

router.post('/signUp', signUp)

router.post('/login', login)

module.exports=router
const express=require('express')
const router=express.Router();
const {sendOTP, signUp, login, isAuthenticated} = require("../controllers/authController");
const auth = require("../middleware/auth");

router.post('/sendOTP',sendOTP)

router.post('/signUp', signUp)

router.post('/login', login)

router.get('/isAuthenticated',auth,isAuthenticated)

module.exports=router
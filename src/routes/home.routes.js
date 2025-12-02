const express=require('express')
const router=express.Router();

const{getHomePageDetails} = require("../controllers/home.controller.js")

router.get('/getHomePageDetails',getHomePageDetails)

module.exports=router
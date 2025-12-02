const express=require('express')
const router=express.Router();

const{getHomePageDetails} = require("../controllers/homeController.js")

router.get('/getHomePageDetails', getHomePageDetails)

module.exports=router
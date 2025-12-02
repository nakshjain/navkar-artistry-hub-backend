const express=require('express')
const router=express.Router();
const tenantResolver=require('../middleware/tenantResolver')

const{getHomePageDetails} = require("../controllers/home.controller.js")

router.get('/getHomePageDetails', tenantResolver,getHomePageDetails)

module.exports=router
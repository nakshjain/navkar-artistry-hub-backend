const HomePageConfig = require("../models/HomePageConfig");

const getHomePageDetails = async (req, res)=>{
    const homePageConfig=await HomePageConfig.findOne()
    if (!homePageConfig) {
        return res.status(404).json({ error: 'Home Page Config Not Found' });
    }
    res.status(200).json(homePageConfig)
}

module.exports={getHomePageDetails}
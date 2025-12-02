const HomePageConfig = require("../models/HomePageConfig");

const getHomePageDetails = async (req, res)=>{
    console.log("method=getHomePageDetails")
    const tenantId = req.tenantId
    const homePageConfig=await HomePageConfig.findOne({tenantId: tenantId})
    if (!homePageConfig) {
        return res.status(404).json({ error: 'Home Page Config Not Found' });
    }
    res.status(200).json(res.addAssetUrl(homePageConfig))
}

module.exports={getHomePageDetails}
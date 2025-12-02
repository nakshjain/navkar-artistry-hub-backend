const getHomePageDetails = async (req, res)=>{
    const jsonObj =
        {
            "branding": {
                "brandName": "Navkar Artistry Hub",
                "brandUserName": "navkarArtistryHub",
                "brandLogo": "/branding/logo.png",
                "titleBackgroundImage": "/navkarArtistryHub/home-page/bg-desktop.png",
                "titleBackgroundImageMobile": "/navkarArtistryHub/home-page/bg-mobile.png"
            },
            "sections": [
                {
                    "id": "category-showcase",
                    "type": "grid",
                    "title": "Explore Categories",
                    "items": [
                        {
                            "alt": "home-page-paintings",
                            "label": "Paintings",
                            "image": "/navkarArtistryHub/home-page/paintings.png",
                            "href": "shop/paintings"
                        },
                        {
                            "alt": "home-page-home-decor",
                            "label": "Home Decor",
                            "image": "/navkarArtistryHub/home-page/home-decor.png",
                            "href": "shop/home-decor"
                        },
                        {
                            "alt": "home-page-jewellery",
                            "label": "Jewellery",
                            "image": "/navkarArtistryHub/home-page/jewellery.png",
                            "href": "shop/jewellery"
                        }
                    ]
                }
            ]
        }
    res.status(200).json(res.addAssetUrl(jsonObj))
}

module.exports={getHomePageDetails}
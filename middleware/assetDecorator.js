const base = process.env.ASSETS_URL;

const assetDecorator = (req, res, next) => {
    res.addAssetUrl = (item) => {
        if (!item) return item;

        const appendUrl = (obj) => {
            if (!obj || typeof obj !== "object") return;

            for (const key in obj) {
                if (key === "imageLinks" && Array.isArray(obj[key])) {
                    obj[key] = obj[key].map((imageUrl) => {
                        if (typeof imageUrl === "string" && imageUrl.startsWith("/")) {
                            return base + imageUrl;
                        }
                        return imageUrl;
                    });
                }
            }
        };

        Array.isArray(item) ? item.forEach(appendUrl) : appendUrl(item);
        return item;
    };

    next();
};

module.exports = assetDecorator;
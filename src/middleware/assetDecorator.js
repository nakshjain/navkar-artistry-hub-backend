const base = process.env.R2_PUBLIC_URL;

const assetDecorator = (req, res, next) => {
    res.addAssetUrl = (item) => {
        if (!item) return item;

        const visited = new WeakSet();

        const processValue = (value) => {
            if (!value) return value;

            // Prevent circular reference crashes
            if (typeof value === "object") {
                if (visited.has(value)) return value;
                visited.add(value);
            }

            if (typeof value === "string") {
                if (value.startsWith("/")) return base + value;
                return value;
            }

            if (Array.isArray(value)) {
                return value.map((el) => processValue(el));
            }

            if (typeof value === "object") {
                for (const key in value) {
                    value[key] = processValue(value[key]);
                }
                return value;
            }

            return value;
        };
        return processValue(item);
    };
    next();
};

module.exports = assetDecorator;

const base = env.CLOUD_PUBLIC_URL;

const assetDecorator = (req, res, next) => {

    const decorate = (item) => {
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

    const originalJson = res.json;
    res.json = function (data) {
        const modified = decorate(data);
        return originalJson.call(this, modified);
    };

    const originalSend = res.send;
    res.send = function (data) {
        if (data && typeof data === "object") {
            data = decorate(data);
        }
        return originalSend.call(this, data);
    };

    next();
};

module.exports = assetDecorator;

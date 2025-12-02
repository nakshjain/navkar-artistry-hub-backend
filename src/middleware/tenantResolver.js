const Tenant = require("../model/Tenant");

const tenantResolver = async (req, res, next) => {
    try {
        req.tenantId = '692f16b58234813eef6d08f6';
        return next();
    } catch (error) {
        console.error("Tenant Resolver Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error in tenant resolver."
        });
    }
};

module.exports = tenantResolver;
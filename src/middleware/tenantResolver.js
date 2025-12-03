const Tenant = require("../models/Tenant");
const requestContext = require("../utils/requestContext");

const tenantResolver = async (req, res, next) => {
    try {
        const host = req.headers.host?.toLowerCase();
        const baseDomain = env.BASE_DOMAIN?.toLowerCase();
        let tenant;

        if (req.query.tenant) {
            tenant = await Tenant.findOne({ brandUserName: req.query.tenant.toLowerCase() });
        }

        if (!tenant) {
            tenant = await Tenant.findOne({ customDomain: host });
        }

        if (!tenant && baseDomain && host.endsWith(baseDomain)) {
            const subdomain = host.replace("." + baseDomain, "");

            if (subdomain !== baseDomain && subdomain.length > 0) {
                tenant = await Tenant.findOne({ assignedDomain: subdomain });
            }
        }

        if (!tenant) {
            return res.status(404).json({
                success: false,
                message: "Tenant not found for this domain or request."
            });
        }

        req.tenant=tenant
        const store = requestContext.get();
        store.req.tenantId = tenant._id;

        next();

    } catch (error) {
        console.error("Tenant Resolver Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error in tenant resolver."
        });
    }
};

module.exports = tenantResolver;
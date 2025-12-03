const requestContext = require("../../utils/requestContext");

module.exports = function tenantPlugin(schema) {

    const ops = [
        "find",
        "findOne",
        "findOneAndUpdate",
        "updateOne",
        "updateMany",
        "deleteOne",
        "deleteMany",
        "count",
        "countDocuments"
    ];

    ops.forEach(op => {
        schema.pre(op, function () {
            const store = requestContext.get();
            const tenantId = store?.req?.tenantId;

            if (tenantId) {
                this.where({ tenantId });
            }
        });
    });

    schema.pre("save", function (next) {
        const store = requestContext.get();
        const tenantId = store?.req?.tenantId;

        if (tenantId && !this.tenantId) {
            this.tenantId = tenantId;
        }
        next();
    });
};
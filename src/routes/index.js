const router = require("express").Router();
const assetDecorator = require("../middleware/assetDecorator");
const tenantResolver = require("../middleware/tenantResolver");

router.use("/health", require("./health.routes"));
router.use("/auth", require("./auth.routes"));
router.use("/home", tenantResolver, assetDecorator, require("./home.routes"));
router.use("/user", tenantResolver, require("./user.routes"));
router.use("/product", tenantResolver, assetDecorator, require("./product.routes"));
router.use("/wishlist", tenantResolver, assetDecorator, require("./wishlist.routes"));
router.use("/cart", tenantResolver, assetDecorator, require("./cart.routes"));
router.use("/order", tenantResolver, assetDecorator, require("./order.routes"));

module.exports = router;
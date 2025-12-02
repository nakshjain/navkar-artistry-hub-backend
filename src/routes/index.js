const router = require("express").Router();
const tenantResolver = require("../middleware/tenantResolver");

router.use("/auth", require("./auth.routes"));
router.use("/home", tenantResolver, require("./home.routes"));
router.use("/user", tenantResolver, require("./user.routes"));
router.use("/product", tenantResolver, require("./product.routes"));
router.use("/wishlist", tenantResolver, require("./wishlist.routes"));
router.use("/cart", tenantResolver, require("./cart.routes"));
router.use("/order", tenantResolver, require("./order.routes"));

module.exports = router;
const router = require("express").Router();

router.use("/auth", require("./auth.routes"));
router.use("/home", require("./home.routes"));
router.use("/user", require("./user.routes"));
router.use("/product", require("./product.routes"));
router.use("/wishlist", require("./wishlist.routes"));
router.use("/cart", require("./cart.routes"));
router.use("/order", require("./order.routes"));

module.exports = router;
const express = require("express");
const router = express.Router();

const authShopRouter = require("./authShop.route");
const authUserRouter = require("./authUser.route");
const shopRouter = require("./shop.route");
const discountRouter = require("./discount.route");
const userRouter = require("./user.route");

router.use("/api/v1/authShop", authShopRouter);
router.use("/api/v1/authUser", authUserRouter);
router.use("/api/v1/shop", shopRouter);
router.use("/api/v1/user", userRouter);
router.use("/api/v1/discount", discountRouter);

module.exports = router;

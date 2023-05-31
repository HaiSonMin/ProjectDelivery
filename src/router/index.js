const express = require("express");
const router = express.Router();

const authRouter = require("./auth.route");
const shopRouter = require("./shop.route");
const adminRouter = require("./admin.router");
const discountRouter = require("./discount.route");

router.use("/api/v1/auth", authRouter);
router.use("/api/v1/shop", shopRouter);
router.use("/api/v1/admin", adminRouter);
router.use("/api/v1/discount", discountRouter);

module.exports = router;

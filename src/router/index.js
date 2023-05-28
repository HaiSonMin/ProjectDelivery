const express = require("express");
const router = express.Router();

const shopRouter = require("./shop.route");

router.use("/api/v1/auth", shopRouter);

module.exports = router;

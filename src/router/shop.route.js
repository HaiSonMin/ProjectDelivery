const express = require("express");
const router = express.Router();

const { createShop, loginShop, logoutShop, refreshAccessTokenShop } = require("../controllers/shop.controller");
const { authentication } = require("../auth/authUntil");

router.route("/signup").post(createShop);
router.route("/login").post(loginShop);
router.route("/refreshAT").post(refreshAccessTokenShop);
router.use(authentication);
router.route("/logout").post(logoutShop);

module.exports = router;

const express = require("express");
const router = express.Router();

const { createUser, loginUser, logoutUser, refreshAccessTokenUser,forgotPassword,resetPassword } = require("../controllers/user.controller");
const { authentication } = require("../auth/authUntil");

router.route("/signup").post(createUser);
router.route("/login").post(loginUser);
router.route("/refreshAT").post(refreshAccessTokenUser);  
router.route("/resetPassword").get(forgotPassword);
router.route("/resetPassword/:secretToken").post(resetPassword);

router.use(authentication);
router.route("/logout").post(logoutUser);

module.exports = router;

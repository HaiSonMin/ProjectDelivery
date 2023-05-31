const express = require("express");
const router = express.Router();

const { signUpShop, signUpUser, login, logOut, refreshAccessToken, forgotPassword, resetPassword } = require("../controllers/auth.controller");
const { authentication, checkAuthIsAdmin } = require("../auth/authUntil");

router.route("/signUpUser").post(signUpUser); 
router.route("/login").post(login);
router.route("/refreshAT").post(refreshAccessToken);
router.route("/resetPassword").get(forgotPassword);
router.route("/resetPassword/:secretToken").post(resetPassword);

router.route("/signUpShop").post(checkAuthIsAdmin,signUpShop);
// router.route("/signupShop").post(authentication, createShop); // Admin will createShop
router.use(authentication);
router.route("/logout").post(logOut);

module.exports = router;

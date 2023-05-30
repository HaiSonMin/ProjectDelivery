const { CREATED, OK } = require("../core/success.response");
const AuthShopService = require("../services/access/authShop.service");
const createShop = async (req, res) => {
  const payload = req.body;
  new CREATED({
    message: "Create Shop Successfully",
    metadata: await AuthShopService.signUp(payload),
  }).send(res);
};

const loginShop = async (req, res) => {
  new OK({
    message: "Login Successfully",
    metadata: await AuthShopService.login(req,res),
  }).send(res);
};

const logoutShop = async (req, res) => {
  new OK({
    message: "Logout Successfully",
    metadata: await AuthShopService.logout(req,res),
  }).send(res);
};

const refreshAccessTokenShop = async (req, res) => {
  new OK({
    message: "Refresh AT Successfully",
    metadata: await AuthShopService.refreshAccessToken(req, res),
  }).send(res);
};

const forgotPassword = async (req, res) => {
  new OK({
    message: "Change Password",
    metadata: await AuthShopService.forgotPassword(req),
  }).send(res);
};

const resetPassword = async (req, res) => {
  new OK({
    message: "Reset Password Successfully",
    metadata: await AuthShopService.resetPassword(req),
  }).send(res);
};

module.exports = { createShop, loginShop, logoutShop, refreshAccessTokenShop,forgotPassword ,resetPassword};

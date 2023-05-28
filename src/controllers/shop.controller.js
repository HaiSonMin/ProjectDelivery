const { CREATED, OK } = require("../core/success.response");
const AuthService = require("../services/access/auth.service");
const createShop = async (req, res) => {
  const payload = req.body;
  new CREATED({
    message: "Create Shop Successfully",
    metadata: await AuthService.signUp(payload),
  }).send(res);
};

const loginShop = async (req, res) => {
  const { email, password } = req.body;
  new OK({
    message: "Login Successfully",
    metadata: await AuthService.login({ email, password, res }),
  }).send(res);
};

const logoutShop = async (req, res) => {
  new OK({
    message: "Logout Successfully",
    metadata: await AuthService.logout(req.user.userId),
  }).send(res);
};

const refreshAccessTokenShop = async (req, res) => {
  new OK({
    message: "Refresh AT Successfully",
    metadata: await AuthService.refreshAccessToken(req, res),
  }).send(res);
};

module.exports = { createShop, loginShop, logoutShop, refreshAccessTokenShop };

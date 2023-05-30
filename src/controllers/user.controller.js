const { CREATED, OK } = require("../core/success.response");
const AuthUserService = require("../services/access/authUser.service");
const createUser = async (req, res) => {
  const payload = req.body;
  new CREATED({
    message: "Create User Successfully",
    metadata: await AuthUserService.signUp(payload),
  }).send(res);
};

const loginUser = async (req, res) => {
  new OK({
    message: "Login Successfully",
    metadata: await AuthUserService.login(req,res),
  }).send(res);
};

const logoutUser = async (req, res) => {
  new OK({
    message: "Logout Successfully",
    metadata: await AuthUserService.logout(req,res),
  }).send(res);
};

const refreshAccessTokenUser = async (req, res) => {
  new OK({
    message: "Refresh AT Successfully",
    metadata: await AuthUserService.refreshAccessToken(req, res),
  }).send(res);
};

const forgotPassword = async (req, res) => {
  new OK({
    message: "Change Password",
    metadata: await AuthUserService.forgotPassword(req),
  }).send(res);
};

const resetPassword = async (req, res) => {
  new OK({
    message: "Reset Password Successfully",
    metadata: await AuthUserService.resetPassword(req),
  }).send(res);
};

module.exports = { createUser, loginUser, logoutUser, refreshAccessTokenUser,forgotPassword ,resetPassword};

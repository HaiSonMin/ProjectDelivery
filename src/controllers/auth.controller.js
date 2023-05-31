const { CREATED, OK } = require("../core/success.response");
const AuthService = require("../services/access/auth.service");

// ------------------------------- SHOP -------------------------------
const signUpUser = async (req, res) => {
  new CREATED({
    message: "Create User Successfully",
    metadata: await AuthService.signUpUser(req, res),
  }).send(res);
};

const signUpShop = async (req, res) => {
  new CREATED({
    message: "Create User Successfully",
    metadata: await AuthService.signUpShop(req, res),
  }).send(res);
};

const login = async (req, res) => {
  new OK({
    message: "Login Successfully",
    metadata: await AuthService.login(req, res),
  }).send(res);
};

const logOut = async (req, res) => {
  new OK({
    message: "Logout Successfully",
    metadata: await AuthService.logout(req, res),
  }).send(res);
};

const refreshAccessToken = async (req, res) => {
  new OK({
    message: "Refresh AT Successfully",
    metadata: await AuthService.refreshAccessToken(req, res),
  }).send(res);
};

const forgotPassword = async (req, res) => {
  new OK({
    message: "Change Password",
    metadata: await AuthService.forgotPassword(req),
  }).send(res);
};

const resetPassword = async (req, res) => {
  new OK({
    message: "Reset Password Successfully",
    metadata: await AuthService.resetPassword(req),
  }).send(res);
};



module.exports = { signUpUser, signUpShop, login, logOut, refreshAccessToken, forgotPassword, resetPassword };

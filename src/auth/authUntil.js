const JWT = require("jsonwebtoken");
const { KeyTokenModel } = require("../models");
const { ForbiddenError, UnauthenticatedError, BadRequestError } = require("../core/error.response");

const HEADERS = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-key",
  PERMISSION_KEY: "x-permissions-key",
  REFRESH_TOKEN: "x-rtoken-id",
};
const createTokenPair = async (payload, privateKey, publicKey) => {
  const accessToken = JWT.sign(payload, publicKey, { expiresIn: "10m" });
  const refreshToken = JWT.sign(payload, privateKey, { expiresIn: "3d" });

  JWT.verify(accessToken, publicKey, (err, decode) => {
    if (err) console.log(`Error verify::: ${err}`);
    else console.log(`Decode verify::: ${JSON.stringify(decode)}`);
  });

  return { accessToken, refreshToken };
};

const authentication = async (req, res, next) => {
  const accessToken = req.headers.authorization;

  if (!accessToken?.startsWith("Bearer ")) throw new ForbiddenError("Token invalid");

  // const userId = req.headers[HEADERS.CLIENT_ID];

  const { refreshToken } = req.cookies
  if (!refreshToken) throw new BadRequestError("refreshToken doesn't exist on cookies");

  const keyStore = await KeyTokenModel.findOne({ refreshTokenUsing: refreshToken });
  if (!keyStore) throw new ForbiddenError("KeyStore invalid");

  const payload = JWT.verify(accessToken.split(" ")[1], keyStore.publicKey);

  // if (userId !== payload.userId) throw new UnauthenticatedError("Invalid userId(client-key)");

  req.user = payload;
  return next();
};

const checkAuthIsShop = async (req, res, next) => {
  await authentication(req, res, next);
  const { role } = req.user;
  if(role !== "SHOP") throw new UnauthenticatedError("You don't have enough permission visit here");
}

const checkAuthIsAdmin = async (req, res, next) => {
  await authentication(req, res, next);
  const { role } = req.user;
  if(role !== "ADMIN") throw new UnauthenticatedError("You don't have enough permission visit here");
}

module.exports = {
  createTokenPair,
  authentication,
  checkAuthIsShop,
  checkAuthIsAdmin
};

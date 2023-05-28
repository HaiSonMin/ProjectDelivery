const JWT = require("jsonwebtoken");
const { KeyTokenModel } = require("../models");
const { ForbiddenError, UnauthenticatedError } = require("../core/error.response");

const HEADERS = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-key",
  PERMISSION_KEY: "x-permissions-key",
  REFRESH_TOKEN: "x-rtoken-id",
};

const createTokenPair = async (payload, privateKey, publicKey) => {
  const accessToken = JWT.sign(payload, publicKey, { expiresIn: "20s" });
  const refreshToken = JWT.sign(payload, privateKey, { expiresIn: "7d" });

  JWT.verify(accessToken, publicKey, (err, decode) => {
    if (err) console.log(`Error verify::: ${err}`);
    else console.log(`Decode verify::: ${JSON.stringify(decode)}`);
  });

  return { accessToken, refreshToken };
};

const authentication = async (req, res, next) => {
  const accessToken = req.headers.authorization;
  console.log(accessToken);

  if (!accessToken.startsWith("Bearer ")) throw new ForbiddenError("Token invalid");

  const userId = req.headers[HEADERS.CLIENT_ID];

  const keyStore = await KeyTokenModel.findOne({ userId });
  if (!keyStore) throw new ForbiddenError("KeyStore invalid");

  const payload = JWT.verify(accessToken.split(" ")[1], keyStore.publicKey);

  if (userId !== payload.userId) throw new UnauthenticatedError("Invalid userId(client-key)");

  req.user = payload;
  return next();
};

module.exports = {
  createTokenPair,
  authentication,
};

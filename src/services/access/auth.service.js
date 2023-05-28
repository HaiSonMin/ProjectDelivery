const { createTokenPair } = require("../../auth/authUntil");
const { BadRequestError } = require("../../core/error.response");
const { ShopModel } = require("../../models");
const createKeys = require("../../utils/createKey");
const KeyTokenService = require("./keytoken.service");
const { getInfoData } = require("../../utils");
const JWT = require("jsonwebtoken");
class AuthService {
  static async signUp({ firstName, lastName, userName, email, password, phoneNumber, role }) {
    const newShop = await ShopModel.create({
      shop_firstName: firstName,
      shop_lastName: lastName,
      shop_userName: userName,
      shop_email: email,
      shop_password: password,
      shop_phoneNumber: phoneNumber,
      shop_role: role,
    });
    if (newShop) {
      //   const { privateKey, publicKey } = createKeys();

      //   const { _id: shopId, shop_userName, shop_email, shop_role } = newShop;
      //   console.log(shopId, privateKey, publicKey);

      //   const keyStore = await KeyTokenService.createKeyToken({ userId: shopId, privateKey, publicKey });
      //   if (!keyStore) throw new BadRequestError("KeyStore Error");

      //   // Create tokens (AT vs RT)
      //   const tokenPair = await createTokenPair({ userId: shopId, userName: shop_userName, email: shop_email, role: shop_role }, privateKey, publicKey);
      return {
        shop: getInfoData(newShop, ["shop_firstName", "shop_lastName", "shop_userName", "shop_email"]),
      };
    }
    throw new BadRequestError("SignUp Error");
  }

  /**
    1. Login with email, password
    2. Create AT & RT
    2.1 AT Authorization
    2.2 RT Refresh for AT
   */
  static async login({ email, password, res }) {
    const foundShop = await ShopModel.findOne({ shop_email: email });

    if (!foundShop) throw new BadRequestError("Invalid credential");

    const isMatchingPassword = await foundShop.comparePassword(password);

    if (!isMatchingPassword) throw new BadRequestError("Invalid credential");

    const { privateKey, publicKey } = createKeys();

    const { _id: shopId, shop_userName, shop_email, shop_role } = foundShop;

    // AT save to Author
    // RT save to DB and Cookie
    const { accessToken, refreshToken } = await createTokenPair(
      { userId: shopId, userName: shop_userName, email: shop_email, role: shop_role },
      privateKey,
      publicKey
    );

    // Save refreshToken to DB
    const keyStore = await KeyTokenService.createKeyToken({ userId: shopId, privateKey, publicKey, refreshTokenUsing: refreshToken });
    if (!keyStore) throw new BadRequestError("KeyStore Error");

    // Save refreshToken to cookie( age: 7day)
    res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

    return {
      shop: getInfoData(foundShop, ["_id", "shop_firstName", "shop_lastName", "shop_userName", "shop_email"]),
      accessToken,
    };
  }

  static async logout(userId) {
    const keyDeleted = await KeyTokenService.deleteTokenByUserId(userId);
    return getInfoData(keyDeleted, ["userId", "refreshTokenUsing"]);
  }

  static async refreshAccessToken(req, res) {
    const { refreshToken } = req.cookies;
    if (!refreshToken) throw new BadRequestError("No RT in cookie");

    const keyStore = await KeyTokenService.findRefreshTokenUsing(refreshToken);
    if (!keyStore) throw new BadRequestError("KeyStore save refresh token dost not exist");

    const { privateKey, publicKey } = keyStore;

    const payload = JWT.verify(refreshToken, privateKey);

    if (!payload) throw new BadRequestError("Verify Token Error");

    const { userId, userName, email, role } = payload;

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await createTokenPair(
      { userId, userName, email, role },
      privateKey,
      publicKey
    );

    // Update refresh token
    await keyStore.updateOne({
      $set: {
        refreshTokenUsing: newRefreshToken,
      },
      $addToSet: {
        refreshTokenUsed: refreshToken,
      },
    });

    // Save refreshToken to cookie( age: 7day)
    res.cookie("refreshToken", newRefreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

    return {
      user: { userId, userName, email },
      newAccessToken,
    };
  }
}

module.exports = AuthService;

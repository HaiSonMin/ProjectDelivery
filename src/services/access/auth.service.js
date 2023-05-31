const { createTokenPair } = require("../../auth/authUntil");
const { BadRequestError, ForbiddenError } = require("../../core/error.response");
const { ShopModel } = require("../../models");
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const createKeys = require("../../utils/createKey.util");
const KeyTokenService = require("./keytoken.service");
const { getInfoData } = require("../../utils/index");
const JWT = require("jsonwebtoken");
const { findShopByEmail, mathSecretTokenShop } = require("../../models/Repositories/shop.repo");
const sendMail = require("../../utils/sendMail.util");
const AdminService = require("../shop/admin.service");
class AuthShopService {
  // Admin will create the Shop
  static async signUpShop(req, res) {
    return await AdminService.createShop(req, res);
  }

  static async signUpUser(req, res) {
    const { firstName, lastName, userName, email, password, phoneNumber } = req.body;
    const newUser = await ShopModel.create({
      shop_firstName: firstName,
      shop_lastName: lastName,
      shop_userName: userName,
      shop_email: email,
      shop_password: password,
      shop_phoneNumber: phoneNumber
    });
    if (newUser) {
      //   const { privateKey, publicKey } = createKeys();

      //   const { _id: shopId, shop_userName, shop_email, shop_role } = newShop;
      //   console.log(shopId, privateKey, publicKey);

      //   const keyStore = await KeyTokenService.createKeyToken({ userId: shopId, privateKey, publicKey });
      //   if (!keyStore) throw new BadRequestError("KeyStore Error");

      //   // Create tokens (AT vs RT)
      //   const tokenPair = await createTokenPair({ userId: shopId, userName: shop_userName, email: shop_email, role: shop_role }, privateKey, publicKey);
      return {
        auth: getInfoData(newUser, ["shop_firstName", "shop_lastName", "shop_userName", "shop_email"]),
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
  static async login(req, res) {

    const { email, password } = req.body;

    // Veryfi Email and Password
    const foundShop = await ShopModel.findOne({ shop_email: email });

    if (!foundShop) throw new BadRequestError("Invalid credential 1");

    const isMatchingPassword = await foundShop.comparePassword(password);

    if (!isMatchingPassword) throw new BadRequestError("Invalid credential 2");

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

  static async logout(req, res) {
    const { refreshToken } = req.cookies
    if (!refreshToken) throw new BadRequestError("No RT in cookie");

    // const keyStore = await KeyTokenService.findRefreshTokenUsing(refreshToken);
    // if (!keyStore) throw new BadRequestError("KeyStore save refresh token dost not exist");

    const keyDeleted = await KeyTokenService.deleteTokenByRefreshToken(refreshToken);
    res.clearCookie('refreshToken', { httpOnly: true, secure: true })
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


  static async forgotPassword(req) {
    /**
     * 1. Client Send mail for Server
     * 2. Server check email validity => Send link for client on gmail
     * 3. Client send mail => Click link => Send API and Token
     */

    const { email } = req.query

    if (!email) throw new BadRequestError('Not found email')

    const shop = await findShopByEmail(email)
    console.log("shop::::", shop)

    const secretKey = shop.createPasswordChanged();
    await shop.save() // Save date to DB
    const html = `Please click here to change password, Password change time expires in 5 minute. <a href=${process.env.LOCAL_HOST}/api/v1/auth/forgotPassword/${secretKey}>Click here</a>`
    const responseEmail = await sendMail(email, html)
    return {
      sendTo: email,
      response: responseEmail
    }
  }

  static async resetPassword(req) {
    /**
     * 1. Client Send mail for Server
     * 2. Server check email validity => Send link for client on gmail
     * 3. Client send mail => Click link => Send API and Token
     */

    const { secretToken } = req.params
    const { newPassword, repeatNewPassword } = req.body

    if (newPassword.trim() !== repeatNewPassword.trim()) throw new BadRequestError("NewPassword must be same RepeatNewPassword")

    const encodeSecretToken = crypto.createHash('sha256').update(secretToken).digest('hex');

    const shop = await mathSecretTokenShop(encodeSecretToken)

    if (!shop) throw new BadRequestError("Secret Token don't matching")

    const passwordEncode = await bcrypt.hash(newPassword, 10);

    await shop.updateOne({
      $set: {
        shop_password: passwordEncode,
        shop_passwordResetSecretKey: undefined,
        shop_passwordResetExpires: undefined,
      },
    });

    return
  }
}

module.exports = AuthShopService;

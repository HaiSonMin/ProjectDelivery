const { NotFoundError } = require("../../core/error.response");
const { KeyTokenModel } = require("../../models");

class KeyTokenService {
  static async createKeyToken({ userId, privateKey, publicKey, refreshTokenUsing = null }) {
    const filter = { userId };
    const dateUpdate = {
      privateKey,
      publicKey,
      refreshTokenUsing,
      refreshTokenUsed: [],
    };
    const options = {
      new: true,
      upsert: true,
    };
    const tokens = await KeyTokenModel.findOneAndUpdate(filter, dateUpdate, options);
    return tokens ? tokens.publicKey : null;
  }

  static async findTokenByUserId(userId) {
    const token = await KeyTokenModel.findById(userId);
    if (!token) throw new NotFoundError("Token dost not exist");
    return token;
  }
  static async deleteTokenById(id) {
    const tokenDeleted = await KeyTokenModel.findOneAndDelete({ _id: id });
    if (!tokenDeleted) throw new NotFoundError("Token dost not exist");
    return tokenDeleted;
  }
  static async deleteTokenByUserId(userId) {
    const tokenDeleted = await KeyTokenModel.findOneAndDelete({ userId });
    if (!tokenDeleted) throw new NotFoundError("Token dost not exist");
    return tokenDeleted;
  }
  static async findRefreshTokenUsed(refreshToken) {
    const token = await KeyTokenModel.findOne({ refreshTokenUsed: refreshToken });
    if (!token) throw new NotFoundError("Token dost not exist");
    return token;
  }
  static async findRefreshTokenUsing(refreshToken) {
    const token = await KeyTokenModel.findOne({ refreshTokenUsing: refreshToken });
    if (!token) throw new NotFoundError("Token dost not exist");
    return token;
  }
}

module.exports = KeyTokenService;

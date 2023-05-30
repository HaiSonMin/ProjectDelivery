const { NotFoundError } = require('../../core/error.response')
const {ShopModel} = require('../index')

const findShopByEmail = async(email) => {
    const shop = await ShopModel.findOne({shop_email:email});
    if(!shop) throw new NotFoundError("Shop not found by email");
    return shop;
}

const mathSecretToken = async(encodeSecretToken) => {
    const ResetSecretToken = await ShopModel
                        .findOne({shop_passwordResetSecretKey:encodeSecretToken, shop_passwordResetExpires:{$gt: Date.now()}})
    if(!ResetSecretToken) throw new NotFoundError("Invalid ResetSecretToken");
    return ResetSecretToken;
}

module.exports = {findShopByEmail,mathSecretToken}
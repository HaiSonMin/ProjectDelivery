const { getUnSelectData, convertObjectIdMongo } = require("../../utils");
const { ShopModel } = require("../index");

const getAllShops = async ({ page = 1, limit = 10, unSelected, role = "SHOP" }) => {
    const skip = (page - 1) * limit
    return await ShopModel.find({ shop_role: role }).select(getUnSelectData(unSelected)).skip(skip).limit(limit).lean().exec();
}

const getShopById = async ({ shopId }) => await ShopModel.findById(shopId)

const searchShops = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch, "i");
    const shops = await ShopModel.find(
        {
            shop_role: "SHOP",
            $text: { $search: regexSearch },
        },
        { score: { $meta: "textScore" } }
    )
        .sort({ score: { $meta: "textScore" } })
        .select(getUnSelectData(["__v", "score"]))
        .lean()
        .exec();
    return shops;
}

const deleteShopById = async ({ shopId }) => {
    console.log("userId:::::", shopId);
    return await ShopModel.findOneAndDelete({ _id: convertObjectIdMongo(shopId), shop_role: "SHOP" }).lean().exec()
};


// ---------------------------------------------- USER ----------------------------------------------

const getAllUsers = async ({ page = 1, limit = 10, unSelected, role = "USER" }) => {
    const skip = (page - 1) * limit
    return await ShopModel.find({ shop_role: role }).select(getUnSelectData(unSelected)).skip(skip).limit(limit).lean().exec();
}

const getUserById = async ({ userId }) => await ShopModel.findById(userId)

const searchUsers = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch, "i");
    const shops = await ShopModel.find(
        {
            shop_role: "USER",
            $text: { $search: regexSearch },
        },
        { score: { $meta: "textScore" } }
    )
        .sort({ score: { $meta: "textScore" } })
        .select(getUnSelectData(["__v", "score"]))
        .lean()
        .exec();
    return shops;
}

const deleteUserById = async ({ userId }) => await ShopModel.findOneAndDelete({ _id: userId, shop_role: "USER" }).lean().exec();
module.exports = {
    getAllShops,
    getShopById,
    searchShops,
    deleteShopById,

    getAllUsers,
    getUserById,
    searchUsers,
    deleteUserById
}
const { BadRequestError, NotFoundError } = require("../../core/error.response");
const { ShopModel } = require("../../models");
const {
    deleteShopById,
    deleteUserById,
    getAllUsers,
    getAllShops,
    getShopById,
    getUserById,
    searchShops,
    searchUsers } = require("../../models/Repositories/admin.repo");
const { deleteAllFoodByShopId } = require("../../models/Repositories/food.repo");
const { getInfoData } = require("../../utils");
class AdminService {
    static async createShop(req, res) {
        const { firstName, lastName, userName, email, password, phoneNumber, address, role = "SHOP" } = req.body;
        const newShop = await ShopModel.create({
            shop_firstName: firstName,
            shop_lastName: lastName,
            shop_userName: userName,
            shop_email: email,
            shop_password: password,
            shop_phoneNumber: phoneNumber,
            shop_address: address,
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
                auth: getInfoData(newShop, ["shop_firstName", "shop_lastName", "shop_userName", "shop_email", "shop_role"]),
            };
        }
        throw new BadRequestError("SignUp Error");
    }

    static async getAllShops(req, res) {
        const { limit, page, role } = req.query;
        const unSelected = ["__v"];
        const shops = await getAllShops({ limit, page, role, unSelected });
        if (!shops) throw new NotFoundError("Not Found Shops");
        return {
            shopRegister: `${shops.length} Shops`,
            shops
        }
    }

    static async getShopById(req, res) {
        const { shopId } = req.params;
        const shop = await getShopById({ shopId });
        if (!shop) throw new NotFoundError("Not Found Shop");
        return shop
    }

    static async searchShops(req, res) {
        const { keySearch } = req.body
        const shops = await searchShops({ keySearch });
        if (!shops) throw new NotFoundError("Not Found Shops");
        return {
            numberShops: `${shops.length} Shops`,
            shops
        }
    }

    static async deleteShopById(req, res) {
        const { shopId } = req.params
        const shop = await deleteShopById({ shopId });
        if (!shop) throw new NotFoundError("Not Found Shop");
        // Delete all food of the shop
        await deleteAllFoodByShopId({shopId})
        return shop
    }

    // ----------------------------------------- USER -----------------------------------------
    static async getAllUsers(req, res) {
        const { limit, page, role } = req.query;
        const unSelected = ["__v"];
        const users = await getAllUsers({ limit, page, role, unSelected });
        if (!users) throw new NotFoundError("Not Found Users");
        return {
            userRegister: `${users.length} Users`,
            users
        }
    }

    static async getUserById(req, res) {
        const { userId } = req.params;
        const user = await getUserById({ userId });
        if (!user) throw new NotFoundError("Not Found User");
        return user
    }

    static async searchUsers(req, res) {
        const { keySearch } = req.body
        const users = await searchUsers({ keySearch });
        if (!users) throw new NotFoundError("Not Found Users");
        return {
            numberUsers: `${users.length} Users`,
            users
        }
    }

    static async deleteUserById(req, res) {
        const { userId } = req.params
        const user = await deleteUserById({ userId });
        if (!user) throw new NotFoundError("Not Found User");
        return user
    }

}

module.exports = AdminService;

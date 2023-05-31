const { OK } = require("../core/success.response")
const AdminService = require("../services/shop/admin.service")

const getAllShops = async (req, res) => {
    new OK({
        message: "Get All Shops Successfully",
        metadata: await AdminService.getAllShops(req, res)
    }).send(res)
}
const getShopById = async (req, res) => {
    new OK({
        message: "Get Shop Successfully",
        metadata: await AdminService.getShopById(req, res)
    }).send(res)
}
const searchShop = async (req, res) => {
    new OK({
        message: "Get All Shops Successfully",
        metadata: await AdminService.searchShops(req, res)
    }).send(res)
}
const deleteShopById = async (req, res) => {
    new OK({
        message: "Delete Shop Successfully",
        metadata: await AdminService.deleteShopById(req, res)
    }).send(res)
}
const getAllUsers = async (req, res) => {
    new OK({
        message: "Get All Users Successfully",
        metadata: await AdminService.getAllUsers(req, res)
    }).send(res)
}
const getUserById = async (req, res) => {
    new OK({
        message: "Get User Successfully",
        metadata: await AdminService.getAllUsers(req, res)
    }).send(res)
}
const searchUsers = async (req, res) => {
    new OK({
        message: "Get All Users Successfully",
        metadata: await AdminService.searchUsers(req, res)
    }).send(res)
}
const deleteUserById = async (req, res) => {
    new OK({
        message: "Delete User Successfully",
        metadata: await AdminService.deleteUserById(req, res)
    }).send(res)
}

module.exports = {
    getAllShops,
    getShopById,
    searchShop,
    deleteShopById,
    getAllUsers,
    getUserById,
    searchUsers,
    deleteUserById
}


const express = require("express");
const router = express.Router();
const { checkAuthIsAdmin } = require("../auth/authUntil");
const {
    getAllShops,
    getShopById,
    searchShop,
    deleteShopById,
    getAllUsers,
    getUserById,
    searchUsers,
    deleteUserById
} = require("../controllers/admin.controller");


router.use(checkAuthIsAdmin) // Only admin
// -------- Shop --------
router.route('/shop').get(getAllShops)
router.route('/shop/search').get(searchShop)
router.route('/shop/:shopId').get(getShopById).delete(deleteShopById)
// -------- User --------
router.route('/user').get(getAllUsers)
router.route('/user/search').get(searchUsers)
router.route('/user/:userId').get(getUserById).delete(deleteUserById)

module.exports = router;
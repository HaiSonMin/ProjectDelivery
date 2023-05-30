const express = require("express");
const router = express.Router();

const {
  createFoodType,
  getAllFoodType,
  createFood,
  getFoodById,
  getFoodByShopId,
  getFoodBySearchField,
  getAllFoods
} = require("../controllers/food.controller");
const { authentication } = require("../auth/authUntil");

//----------------------------------------------------------//

router.route("/food/search").get(getFoodBySearchField);
router.route("/food").get(getAllFoods);
//////////////////////////
router.use(authentication);
//////////////////////////
// ---------------- Food ----------------
router.route("/food").post(createFood);
router.route("/food/getByShop").get(getFoodByShopId);
router.route("/food/getById/:foodId").get(getFoodById);

// ---------------- Type Food ----------------
router.route("/typeFood").post(createFoodType);
router.route("/typeFood").get(getAllFoodType);

module.exports = router;

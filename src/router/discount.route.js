const express = require("express");
const router = express.Router();

const {
  createDiscount,
  getAllDiscount,
  getFoodsByDiscountCode,
  getDiscountByCode,
  getAllDiscountByShopId,
  updateDiscount,
  deleteDiscount,
} = require("../controllers/discount.controller");

const { authentication } = require("../auth/authUntil");


router.use(authentication);
router.route("/").post(createDiscount);
router.route("/").get(getAllDiscount);
router.route("/getByShop").get(getAllDiscountByShopId);
router.route("/getByCode").get(getDiscountByCode);
router.route("/getFood").get(getFoodsByDiscountCode);
router.route("/:discountId").patch(updateDiscount);
router.route("/:discountId").delete(deleteDiscount);

module.exports = router;

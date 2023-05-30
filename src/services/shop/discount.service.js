const { BadRequestError, NotFoundError } = require("../../core/error.response");
const { DiscountModel, FoodModel } = require("../../models");
const {
  foundDiscount,
  getDiscountsByShopId,
  getDiscountByCode,
} = require("../../models/Repositories/discount.repo");
const { getAllFoods } = require("../../models/Repositories/food.repo");
const { getUnSelectData, convertObjectIdMongo } = require("../../utils");
const { getFoodBySearchField } = require("./shop.service");
class DiscountService {
  static async createDiscount(req, res) {
    const { userId: discount_shopId } = req.user;
    const { discount_code } = req.body
    const filter = {
      discount_shopId: convertObjectIdMongo(discount_shopId),
      discount_code
    }
    console.log("filter:::", filter)

    const discount = await foundDiscount({ filter })

    console.log("discount:::", discount)

    if (discount && discount.discount_isActive) throw new BadRequestError("Discount Has Exist");

    const dataCreate = {
      ...req.body,
      discount_shopId,
    };

    const newDiscount = await DiscountModel.create(dataCreate);
    if (!newDiscount) throw new BadRequestError("Create Discount Error");
    return newDiscount;
  }

  static async getDiscountByCode(req, res) {
    const { discount_code } = req.body;
    const { userId: discount_shopId } = req.user;
    const unSelected = ["__v"];
    const filter = {
      discount_code,
      discount_shopId,
    }
    const discount = await getDiscountByCode({
      filter,
      unSelected,
    });
    if (!discount) throw new BadRequestError("Discount Doesn't Exist");

    const {
      discount_isActive,
      discount_end_date,
      discount_max_uses,
      discount_use_count
    } = discount

    if (!discount_isActive || discount_end_date < new Date()) throw new BadRequestError("Discount Has Expired");

    if (discount_use_count >= discount_max_uses) throw new BadRequestError("Discount Has Out Of");

    return discount;
  }

  static async getDiscountByShopId(req, res) {
    const { userId: discount_shopId } = req.user;
    const unSelected = ["__v"];
    const filter = {
      discount_shopId,
    }
    const discounts = await getDiscountsByShopId({
      filter,
      unSelected
    });
    if (!discounts) throw new BadRequestError("Create Discount Error");
    return discounts;
  }

  static async getFoodsByDiscountCode(req, res) {
    const { userId: discount_shopId } = req.user;
    const { discountCode: discount_code, limit, page, sort } = req.query;
    const unSelected = ['__v'];
    const filter = {
      discount_code,
      discount_shopId,
    }
    const discount = await foundDiscount({ filter })

    if (!discount) throw new BadRequestError("Discount Doesn't Exist");

    const {
      discount_isActive,
      discount_end_date,
      discount_max_uses,
      discount_use_count
    } = discount

    if (!discount_isActive || discount_end_date < new Date()) throw new BadRequestError("Discount Has Expired");

    if (discount_use_count >= discount_max_uses) throw new BadRequestError("Discount Has Out Of");

    const { discount_applies_to, discount_foodApplies } = discount
    let foods;

    if (discount_applies_to === "all") {
      foods = await getAllFoods({ limit, page, sort, unSelected });
      if (!foods) throw new NotFoundError("Not Found Food With Discount Code");
    } else {
      const skip = (+page - 1) * +limit
      const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
      foods = await FoodModel.find({
        _id: { $in: discount_foodApplies }
      }).select(getUnSelectData(unSelected)).skip(skip).limit(+limit).sort(sortBy).lean().exec()
      if (!foods) throw new NotFoundError("Not Found Food With Discount Code");
    }
    return {
      discountCode: discount.discount_code,
      quantityFood: `Number foods applies discount: ${foods.length}`,
      foods,
    };
  }

  static async getDiscountAmount(req, res) {
    /**
     * 1. Check discount has exist and has active
     * 2. Check type of discount (fix_amount || percentage)
     * 3. Calculate price of food with discount has applied
     */
    const filter = {
      discount_code,
      discount_shopId,
    }
    const discount = await foundDiscount({ filter })
    if (!discount || !discount.discount_isActive) throw new BadRequestError("Discount Has Expired Or Not Exist")
    if (discount.discount_max_uses <= discount.discount_use_count) throw new BadRequestError("Discount Has Out Of")
    if (new Date(discount.discount_end_date) <= new Date()) throw new BadRequestError("Discount Has Out Of")
    const productAmount = discount.discount_foodApplies;
    let discountAmount;
    let totalAmount;
    if (discount.discount_type === "fixed_amount") {

    }

  }
}

module.exports = DiscountService;

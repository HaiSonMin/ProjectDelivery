// food_name;
// food_price;
// food_image;
// food_ingredient;
// food_status;
// food_description;
// food_ratingAverage;
// food_customersRating;
const { BadRequestError } = require("../../core/error.response");
const { FoodModel, FoodTypeModel } = require("../../models");
const {
  getFoodById,
  getFoodsByShopId,
  getFoodBySearchField,
  getAllFoods,
} = require("../../models/Repositories/food.repo");

const { getAllTypeFood } = require("../../models/Repositories/foodType.repo");
const { getSelectData, getUnSelectData } = require("../../utils");

class FoodService {
  // ------------------ TypeFood ------------------
  static async createTypeFood(req, res) {
    const dataCreate = {
      ...req.body,
      foodType_shopId: req.user.userId
    }
    const newTypeFood = await FoodTypeModel.create(dataCreate);
    if (!newTypeFood) throw new BadRequestError("Create type food error");
    return newTypeFood;
  }

  static async getAllTypeFood(req, res) {
    const select = getSelectData(["foodType_name", "foodType_description", "foodType_shopId"]);
    const { limit, page } = req.query;
    const foodTypeList = await getAllTypeFood({ limit, page, select });
    if (!foodTypeList || foodTypeList.length === 0) throw new BadRequestError("Food Type Not Found");
    return foodTypeList;
  }

  // ------------------ Food ------------------
  static async createFood(req, res) {
    const { userId: food_shopId } = req.user;
    const dataCreate = {
      ...req.body,
      food_shopId,
    };
    const newFood = await FoodModel.create(dataCreate);
    if (!newFood) throw new BadRequestError("Create food error");
    return newFood;
  }

  static async getFoodById(req, res) {
    const { foodId } = req.params;
    const unSelected = ["__v"];
    const food = await getFoodById({ food_id: foodId, unSelected });
    if (!food) throw new BadRequestError("Food Not Found");
    return food;
  }

  static async getFoodByShopId(req, res) {
    const { limit, page, sort } = req.query;
    const { userId: food_shopId } = req.user;
    const query = { food_shopId };
    const unSelected = ["__v"];
    const foods = await getFoodsByShopId({
      query,
      limit,
      page,
      sort,
      unSelected,
    });
    if (!foods) throw new BadRequestError("Foods Not Found");
    return foods;
  }

  static async getFoodBySearchField(req, res) {
    const { keySearch, limit, page } = req.query;
    // const { keySearch } = req.params;
    console.log("keySearch, limit, page::::", keySearch, limit, page);
    const foods = await getFoodBySearchField({
      keySearch,
      limit: 10,
      page: 1,
    });
    if (!foods) throw new BadRequestError("Foods Not Found");
    return foods;
  }

  static async getAllFoods(req, res) {
    const unSelected = ["__v"];
    const { limit, page, sort } = req.query;
    const foods = await getAllFoods({ limit, page, sort, unSelected });
    if (!foods) throw new BadRequestError("Foods Not Found");
    return foods;
  }
}

module.exports = FoodService;

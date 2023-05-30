const { CREATED, OK } = require("../core/success.response");
const FoodService = require("../services/shop/shop.service");

// ----------------------- Type Food -----------------------
const createFoodType = async (req, res) => {
  new CREATED({
    message: "Create Type Successfully",
    metadata: await FoodService.createTypeFood(req),
  }).send(res);
};

const getAllFoodType = async (req, res) => {
  new OK({
    message: "Get All TypeFood Successfully",
    metadata: await FoodService.getAllTypeFood(req),
  }).send(res);
};

// ----------------------- Food -----------------------
const createFood = async (req, res) => {
  new CREATED({
    message: "Create New Food Successfully",
    metadata: await FoodService.createFood(req),
  }).send(res);
};

const getFoodById = async (req, res) => {
  new OK({
    message: "Get Food Successfully",
    metadata: await FoodService.getFoodById(req),
  }).send(res);
};

const getFoodByShopId = async (req, res) => {
  new OK({
    message: "Get Foods Successfully",
    metadata: await FoodService.getFoodByShopId(req),
  }).send(res);
};

const getFoodBySearchField = async (req, res) => {
  new OK({
    message: "Get Foods Successfully",
    metadata: await FoodService.getFoodBySearchField(req),
  }).send(res);
};

const getAllFoods = async (req, res) => {
  new OK({
    message: "Get Foods Successfully",
    metadata: await FoodService.getAllFoods(req),
  }).send(res);
};

module.exports = {
  createFoodType,
  getAllFoodType,
  createFood,
  getFoodById,
  getFoodByShopId,
  getFoodBySearchField,
  getAllFoods
};

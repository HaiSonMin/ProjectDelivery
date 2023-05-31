const { NotFoundError } = require("../../core/error.response");
const { FoodModel } = require("../index");
const { getSelectData, getUnSelectData } = require("../../utils");

const getAllFoodIsDraft = async ({ query, limit, page }) => {
  const skip = (page - 1) * limit;
  const FoodsIsDraft = queryFood({ query, limit, skip });
  if (!FoodsIsDraft) throw new NotFoundError("Not Found Food");
  return FoodsIsDraft;
};
const getAllFoodIsPublished = async ({ query, limit, page }) => {
  const skip = (page - 1) * limit;
  const FoodsIsPublish = queryFood({ query, limit, skip });
  if (!FoodsIsPublish) throw new NotFoundError("Not Found Food");
  return FoodsIsPublish;
};

const getFoodById = async ({ food_id, unSelected }) => {
  const food = await FoodModel.findById(food_id)
    .select(getUnSelectData(unSelected))
    .populate("food_typeId")
    .lean()
    .exec();
  return food;
};

const getFoodsByShopId = async ({ query, limit, page, sort, unSelected }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const foods = await FoodModel.find(query)
    .sort(sortBy)
    .populate("food_typeId food_shopId")
    .skip(skip)
    .limit(limit)
    .select(getUnSelectData(unSelected))
    .lean()
    .exec();
  return foods;
};

const getAllFoods = async ({ limit, page, sort, unSelected }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  return await FoodModel.find()
    .sort(sortBy)
    .populate("food_typeId food_shopId")
    .skip(skip)
    .limit(limit)
    .select(getUnSelectData(unSelected))
    .lean()
    .exec();
};

/**
 *
 * @param {keySearch} #Key Search enter from user
 * @returns {JSON}
 */
// Search only "Published" Food
const getFoodBySearchField = async ({ keySearch, limit, page }) => {
  const skip = (page - 1) * limit;
  const regexSearch = new RegExp(keySearch, "i");
  const results = await FoodModel.find(
    {
      $text: { $search: regexSearch },
    },
    { score: { $meta: "textScore" } }
  )
    // .sort({ score: { $meta: "textScore" } })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
  return results;
};

const updateFoodIsDraftToPublish = async ({ food_shopId, food_id }) => {
  const Food = await FoodModel.findOne({ Food_shopId, _id: Food_id });
  if (!Food) throw new NotFoundError("Not Found Food");

  Food.isDraft = false;
  Food.isPublished = true;

  // If update success = 1, Opposite = 0
  const { modifiedCount } = await Food.updateOne(Food);
  return modifiedCount;
};
const updateFoodIsPublishedToDraft = async ({ food_shopId, food_id }) => {
  const Food = await FoodModel.findOne({ Food_shopId, _id: Food_id });
  if (!Food) throw new NotFoundError("Not Found Food");

  Food.isDraft = true;
  Food.isPublished = false;

  // If update success = 1, Opposite = 0
  const { modifiedCount } = await Food.updateOne(Food);
  return modifiedCount;
};

const updateFoodById = async ({ food_id, payload, Model, isNew = true }) => {
  return await Model.findOneAndUpdate({ _id: food_id }, payload, {
    new: isNew,
    runValidators: true,
  });
};

const deleteAllFoodByShopId = async ({ shopId }) => {
  return await FoodModel.deleteMany({ food_shopId: shopId }).lean().exec();
}

module.exports = {
  getFoodById,
  getFoodsByShopId,
  getFoodBySearchField,
  getAllFoods,
  getAllFoodIsDraft,
  getAllFoodIsPublished,
  updateFoodById,
  updateFoodIsDraftToPublish,
  updateFoodIsPublishedToDraft,
  deleteAllFoodByShopId
};

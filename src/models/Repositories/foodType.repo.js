const { NotFoundError } = require("../../core/error.response");
const { FoodTypeModel } = require("../index");
const getAllTypeFood = async ({ limit, page, select }) => {
  const skip = (page - 1) * limit;
  const foodTypeList = await FoodTypeModel.find()
    .skip(skip)
    .limit(limit)
    .select(select)
    .lean()
    .exec();
  return foodTypeList;
};
module.exports = { getAllTypeFood };

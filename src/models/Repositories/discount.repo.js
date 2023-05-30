const { getUnSelectData } = require("../../utils");
const { DiscountModel } = require("../index");

const foundDiscount = async ({
  filter
}) => {
  return await DiscountModel.findOne(filter)
    .lean()
    .exec();
};

const getDiscountByCode = async ({
  filter,
  unSelected,
}) => {
  return await DiscountModel.findOne(filter)
    .select(getUnSelectData(unSelected))
    .lean()
    .exec();
};

const getDiscountsByShopId = async ({ filter, unSelected }) => {
  return await DiscountModel.find(filter)
    .select(getUnSelectData(unSelected))
    .lean()
    .exec();
};

module.exports = { foundDiscount, getDiscountByCode, getDiscountsByShopId };

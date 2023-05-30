const { OK, CREATED } = require("../core/success.response");
const DiscountService = require('../services/shop/discount.service')

const createDiscount = async (req, res) => {
  new CREATED({
    message: "Created Discount Successfully",
    metadata: await DiscountService.createDiscount(req,res)
  }).send(res);
};

const getDiscountByCode = async (req, res) => {
  new OK({
    message: "Get Discount Successfully",
    metadata: await DiscountService.getDiscountByCode(req,res),
  }).send(res);
};

const getAllDiscountByShopId = async (req, res) => {
  new OK({
    message: "Get All Discount By Shop Successfully",
    metadata: await DiscountService.getDiscountByShopId(req,res),
  }).send(res);
};

const getFoodsByDiscountCode = async (req, res) => {
    new OK({
      message: "Get Food With Discount Successfully",
      metadata: await DiscountService.getFoodsByDiscountCode(req,res),
    }).send(res);
  };

const getAllDiscount = async (req, res) => {
  new OK({
    message: "Created Discount Successfully",
    metadata: "getAllDiscount",
  }).send(res);
};

const updateDiscount = async (req, res) => {
  new OK({
    message: "Updated Discount Successfully",
    metadata: "updateDiscount",
  }).send(res);
};

const deleteDiscount = async (req, res) => {
  new OK({
    message: "Deleted Discount Successfully",
    metadata: "deleteDiscount",
  }).send(res);
};

module.exports = {
  createDiscount,
  getDiscountByCode,
  getFoodsByDiscountCode,
  getAllDiscountByShopId,
  getAllDiscount,
  updateDiscount,
  deleteDiscount,
};

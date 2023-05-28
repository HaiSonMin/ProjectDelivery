const { NotFoundError } = require("../../core/error.response");
const { ProductModel } = require("../../models/index");
const { getSelectData, getUnSelectData } = require("../../utils");

const getAllProductIsDraft = async ({ query, limit, skip }) => {
  const productsIsDraft = queryProduct({ query, limit, skip });
  if (!productsIsDraft) throw new NotFoundError("Not Found Product");
  return productsIsDraft;
};
const getAllProductIsPublished = async ({ query, limit, skip }) => {
  const productsIsPublish = queryProduct({ query, limit, skip });
  if (!productsIsPublish) throw new NotFoundError("Not Found Product");
  return productsIsPublish;
};

const queryProduct = async ({ query, limit, skip }) => {
  return await ProductModel.find(query).populate("product_attributes product_shopId").skip(skip).limit(limit).lean().exec();
};

/**
 *
 * @param {keySearch} #Key Search enter from user
 * @returns {JSON}
 */
// Search only "Published" product
const getProductsByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch, "i");
  const results = await ProductModel.find(
    {
      isPublished: true,
      $text: { $search: regexSearch },
    },
    { score: { $meta: "textScore" } }
  )
    .sort({ score: { $meta: "textScore" } })
    .lean()
    .exec();
  return results;
};

const getAllProducts = async ({ limit, page, sort, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  return await ProductModel.find(filter)
    .sort(sortBy)
    .populate("product_attributes product_shopId")
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()
    .exec();
};

const getProduct = async ({ product_id, unSelected }) => {
  return await ProductModel.find({ _id: product_id }).select(getUnSelectData(unSelected)).populate("product_attributes product_shopId").lean().exec();
};

const updateProductIsDraftToPublish = async ({ product_shopId, product_id }) => {
  const product = await ProductModel.findOne({ product_shopId, _id: product_id });
  if (!product) throw new NotFoundError("Not Found product");

  product.isDraft = false;
  product.isPublished = true;

  // If update success = 1, Opposite = 0
  const { modifiedCount } = await product.updateOne(product);
  return modifiedCount;
};
const updateProductIsPublishedToDraft = async ({ product_shopId, product_id }) => {
  const product = await ProductModel.findOne({ product_shopId, _id: product_id });
  if (!product) throw new NotFoundError("Not Found Product");

  product.isDraft = true;
  product.isPublished = false;

  // If update success = 1, Opposite = 0
  const { modifiedCount } = await product.updateOne(product);
  return modifiedCount;
};

const updateProductById = async ({ product_id, payload, Model, isNew = true }) => {
  return await Model.findOneAndUpdate({ _id: product_id }, payload, { new: isNew, runValidators: true });
};

module.exports = {
  getProduct,
  getAllProducts,
  getProductsByUser,
  getAllProductIsDraft,
  getAllProductIsPublished,
  updateProductById,
  updateProductIsDraftToPublish,
  updateProductIsPublishedToDraft,
};

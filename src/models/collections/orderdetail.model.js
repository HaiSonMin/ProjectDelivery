const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { model, Schema } = require("mongoose"); // Erase if already required
const COLLECTION_NAME = "OrderDetail";
// Declare the Schema of the Mongo model
const orderDetailSchema = new Schema(
  {
    orderdetail_orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "Please provide order id"],
    },
    orderdetail_amount: {
      type: Number,
      default: 0,
    },
    orderdetail_discount: {
      type: Number,
      default: 0,
    },
    orderdetail_tax: {
      type: Number,
      default: 0,
    },
    orderdetail_totalAmount: {
      type: Number,
      default: 0,
    },
    orderdetail_foodOrdered: {
      type: [Schema.Types.ObjectId],
      ref: "Food",
      required: [true, "Please provide food id"],
    },
    orderdetail_paymentId: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      required: [true, "Please provide payment id"],
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = model(COLLECTION_NAME, orderDetailSchema);

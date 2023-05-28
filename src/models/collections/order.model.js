const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { model, Schema } = require("mongoose"); // Erase if already required
const COLLECTION_NAME = "Order";
// Declare the Schema of the Mongo model
const orderSchema = new Schema(
  {
    order_shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: [true, "Please provide shop id"],
    },
    order_customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "Please provide customer id"],
    },
    order_totalAmount: {
      type: Number,
      default: 0,
    },
    order_status: {
      type: Boolean,
      default: false,
    },
    order_detail: {
      type: Schema.Types.ObjectId,
      ref: "OrderDetail",
      required: [true, "Please provide order detail id"],
    },
    order_processedByCustomer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "Please provide customer id"],
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = model(COLLECTION_NAME, orderSchema);

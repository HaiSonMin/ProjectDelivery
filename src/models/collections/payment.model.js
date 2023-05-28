const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { model, Schema } = require("mongoose"); // Erase if already required
const COLLECTION_NAME = "Payment";
// Declare the Schema of the Mongo model
const paymentSchema = new Schema(
  {
    payment_shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: [true, "Please provide payment Shop id"],
    },
    payment_amount: {
      type: Number,
      default: 0,
    },
    payment_paidBy: {
      type: String,
      required: [true, "Please provide payment paid by"],
    },
    payment_processedBy: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "Please provide payment processed by (Customer )"],
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = model(COLLECTION_NAME, paymentSchema);

﻿const bcrypt = require("bcrypt");
const { model, Schema } = require("mongoose"); // Erase if already required
const COLLECTION_NAME = "Shop";
// Declare the Schema of the Mongo model
const shopSchema = new Schema(
  {
    shop_firstName: {
      type: String,
      required: [true, "Please provide shop firstName"],
      maxlength: 50,
    },
    shop_lastName: {
      type: String,
      required: [true, "Please provide shop lastName"],
      maxlength: 50,
    },
    shop_phoneNumber: {
      type: String,
      unique: [true, "Phone number has exist"],
      maxlength: 20,
    },
    shop_email: {
      type: String,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        ,
        "Please provide valid email",
      ],
      unique: true,
      required: [true, "Please provide email"],
      maxlength: 50,
    },
    shop_role: {
      type: String,
      enum: ["SHOP", "ADMIN"],
      default: "SHOP",
    },
    shop_userName: {
      type: String,
      required: [true, "Please provide shop user name"],
    },
    shop_password: {
      type: String,
      required: [true, "Please provide shop password"],
    },
    shop_ratingPoint: {
      type: Number,
      default: 4,
      min: [1, "Rating must be getter than 1"],
      max: [5, "Rating must be less then 5"],
      set: (val) => Math.round((val * 10) / 10),
    },
    shop_siteId: {
      type: Schema.Types.ObjectId,
      ref: "Site",
    },
    shop_shippingId: {
      type: Schema.Types.ObjectId,
      ref: "Shipping",
    },
  },
  {
    timestamps: true,
  }
);

shopSchema.pre("save", async function (next) {
  this.shop_password = await bcrypt.hash(this.shop_password, 10);
  next();
});

shopSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.shop_password);
};

//Export the model
module.exports = model(COLLECTION_NAME, shopSchema);
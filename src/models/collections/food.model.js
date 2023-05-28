const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { model, Schema } = require("mongoose"); // Erase if already required
const COLLECTION_NAME = "Food";
// Declare the Schema of the Mongo model
const foodSchema = new Schema(
  {
    food_name: {
      type: String,
      required: [true, "Please provide food name"],
      maxlength: 100,
    },
    food_price: {
      type: Number,
      required: [true, "Please provide food price"],
    },
    food_image: {
      type: String,
    },
    food_ingredient: {
      type: String,
      required: [true, "Please provide food ingredient"],
    },
    food_status: {
      type: Boolean,
      default: false,
    },
    food_ratingAverage: {
      type: Number,
      default: 4,
      min: [1, "Rating must be getter than 1"],
      max: [5, "Rating must be less then 5"],
      set: (val) => Math.round((val * 10) / 10),
    },
    food_customersRating: {
      type: [Schema.Types.ObjectId],
      ref: "Customer",
      default: [],
    },
    isDraft: {
      type: Boolean,
      default: true,
    },
    isPublish: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = model(COLLECTION_NAME, foodSchema);

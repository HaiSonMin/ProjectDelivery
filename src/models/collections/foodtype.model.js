const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { model, Schema } = require("mongoose"); // Erase if already required
const COLLECTION_NAME = "FoodType";
// Declare the Schema of the Mongo model
const foodTypeSchema = new Schema(
  {
    foodType_name: {
      type: String,
      required: [true, "Please provide menutype name "],
      maxlength: 50,
    },
    foodType_description: {
      type: String,
      required: [true, "Please provide description name "],
      maxlength: 100,
    },
    foodType_shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: [true, "Please provide shop Id of food"],
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = model(COLLECTION_NAME, foodTypeSchema);

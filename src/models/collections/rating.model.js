const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { model, Schema } = require("mongoose"); // Erase if already required
const COLLECTION_NAME = "Rating";
// Declare the Schema of the Mongo model
const ratingSchema = new Schema(
  {
    rating_point: {
      type: Number,
      default: 4,
      min: [1, "Rating must be getter than 1"],
      max: [5, "Rating must be less then 5"],
    },
    rating_review: {
      type: String,
      maxlength: 100,
    },
    rating_byCustomer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "Please provide customer id has been rated"],
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = model(COLLECTION_NAME, ratingSchema);

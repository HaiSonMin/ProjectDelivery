const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { model, Schema } = require("mongoose"); // Erase if already required
const COLLECTION_NAME = "Site";
// Declare the Schema of the Mongo model
const siteSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please provide firstName"],
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: [true, "Please provide lastName"],
      maxlength: 50,
    },
    email: {
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
    userName: {
      type: String,
      required: [true, "Please provide user name"],
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
    },
    role: {
      type: String,
      required: [true, "Please provide password"],
      enum: ["SHOP", "CUSTOMER", "ADMIN"],
    },
    shopActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = model(COLLECTION_NAME, siteSchema);

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { model, Schema } = require("mongoose"); // Erase if already required
const COLLECTION_NAME = "Customer";
// Declare the Schema of the Mongo model
const customerSchema = new Schema(
  {
    customer_firstName: {
      type: String,
      required: [true, "Please provide customer first name"],
      maxlength: 50,
    },
    customer_lastName: {
      type: String,
      required: [true, "Please provide customer last name"],
      maxlength: 50,
    },
    customer_email: {
      type: String,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        ,
        "Please provide valid email",
      ],
      unique: true,
      required: [true, "Please provide customer email"],
      maxlength: 50,
    },
    customer_phoneNumber: {
      type: String,
    },
    customer_image: {
      type: String,
    },
    customer_userName: {
      type: String,
      required: [true, "Please provide customer user name"],
    },
    customer_password: {
      type: String,
      required: [true, "Please provide password"],
    },
    customer_status: {
      type: Boolean,
      default: true,
    },
    customer_rating: {
      type: Schema.Types.ObjectId,
      ref: "Rating",
    },
    customer_order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
  },
  {
    timestamps: true,
  }
);

customerSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

customerSchema.methods.comparePassword = async function (password) {
  const isMatchingPassword = await bcrypt.compare(password, this.password);
  return isMatchingPassword;
};

//Export the model
module.exports = model(COLLECTION_NAME, customerSchema);

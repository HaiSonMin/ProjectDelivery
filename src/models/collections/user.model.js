const bcrypt = require("bcrypt");
const { model, Schema } = require("mongoose"); // Erase if already required
const COLLECTION_NAME = "User";
// Declare the Schema of the Mongo model
const userSchema = new Schema(
  {
    user_firstName: {
      type: String,
      required: [true, "Please provide user first name"],
      maxlength: 50,
    },
    user_lastName: {
      type: String,
      required: [true, "Please provide user last name"],
      maxlength: 50,
    },
    user_email: {
      type: String,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        ,
        "Please provide valid email",
      ],
      unique: true,
      required: [true, "Please provide user email"],
      maxlength: 50,
    },
    user_phoneNumber: {
      type: String,
    },
    user_image: {
      type: String,
    },
    user_role: {
      type: String,
      default:"USER"
    },
    user_userName: {
      type: String,
      required: [true, "Please provide user name"],
    },
    user_password: {
      type: String,
      required: [true, "Please provide password"],
    },
    user_status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (password) {
  const isMatchingPassword = await bcrypt.compare(password, this.password);
  return isMatchingPassword;
};

//Export the model
module.exports = model(COLLECTION_NAME, userSchema);

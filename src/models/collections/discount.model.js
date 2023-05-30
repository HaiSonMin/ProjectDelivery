const { model, Schema } = require("mongoose"); // Erase if already required
const { BadRequestError } = require("../../core/error.response");
const COLLECTION_NAME = "Discount";
const discountSchema = new Schema(
  {
    discount_name: {
      type: String,
      required: [true, "Please provide discount name"],
    },
    discount_description: {
      type: String,
      required: [true, "Please provide discount description"],
    },
    discount_code: {
      type: String,
      unique: [true, 'Discount code has exist, please enter another discount code'],
      required: [true, "Please provide discount code"],
    },
    discount_type: {
      type: String,
      enum: ["fixed_amount", "percentage"], // Ex: ["fixed_amount", "percentage"]
      default: "fixed_amount",
    },
    discount_value: {
      type: Number, // Ex: ["20000vnđ", "20%"]
      min: [1, "Please enter value discount getter than 1"],
      required: [true, "Please provide discount value "],
    },
    discount_start_date: {
      type: Date,
      required: [true, "Please provide discount start date` "],
    },
    discount_end_date: {
      type: Date,
      required: [true, "Please provide discount end date` "],
    },
    discount_max_uses: {
      type: Number, // Ex: 100 discount code
      required: [true, "Please provide discount max uses "],
    },
    discount_use_count: {
      type: Number, // Ex: How much discount used ? => 21 discount used
      default: 0, // Ex: How much discount used ? => 21 discount used
    },
    discount_user_used: {
      type: Array, // Ex: Who used the discount code ?
      default: [], // ObjectId of Customer
    },
    discount_max_uses_per_user: {
      type: Number, // Ex: How much discount can each user use?
      default: 1,
    },
    discount_min_order_value: {
      type: Number, // Ex: How much discount can each user use?
      required: [true, "Please provide discount min order value of customer"],
    },
    discount_shopId: {
      type: Schema.Types.ObjectId, // Ex: Minimum order value to apply discount
      ref: "Shop",
      required: true,
    },
    discount_isActive: {
      type: Boolean, // Ex: How much discount can each user use?
      default: true,
    },
    discount_applies_to: {
      type: String, // Ex: Specific product to applies discount
      enum: ["all", "specific"],
      default: "specific",
    },
    discount_foodApplies: {
      type: [Schema.Types.ObjectId], // Ex: Number product to applies discount if have to specific
      default: [], // ObjectId Foods
    },
  },
  {
    timestamps: true,
  }
);
discountSchema.pre('save', function (next) {
  if (new Date(this.discount_start_date) > new Date(this.discount_end_date))
    throw new BadRequestError("Start Date must be less than equal End Date")
  next();
})


//Export the model
module.exports = model(COLLECTION_NAME, discountSchema);

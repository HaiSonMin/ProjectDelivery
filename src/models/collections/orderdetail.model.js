
const { model, Schema } = require("mongoose"); // Erase if already required
const COLLECTION_NAME = "OrderDetail";
// Declare the Schema of the Mongo model
const orderDetailSchema = new Schema(
  {
    orderdetail_amount: { 
      type: Number, // Price all food
      default: 0,
    },
    orderdetail_discount: {
      type: Number, // Total discount for per food 
      default: 0,
    },
    orderdetail_tax: {
      type: Number, // Percentage
      default: 10,
    },
    orderdetail_totalAmount: {
      type: Number, // PriceFoods - Discount + Tax + (Service)
      default: 0,
    },
    orderdetail_discountId: {
      type: Schema.Types.ObjectId,
      ref: "Discount",
      required: [true, "Please provide discount id"],
    },
    orderdetail_orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "Please provide order id"],
    },
    orderdetail_paymentId: {
      type: Schema.Types.ObjectId, // Applied when customer payment food
      ref: "Payment",
    },
    // order_foodOrdered: {
    //   type: [Schema.Types.ObjectId],
    //   ref: "Food",
    //   required: [true, "Please provide foods id"],
    // },
    // orderdetail_shopId: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Discount",
    //   required: [true, "Please provide discount id"],
    // },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = model(COLLECTION_NAME, orderDetailSchema);

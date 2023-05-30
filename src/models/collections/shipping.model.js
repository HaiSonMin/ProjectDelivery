
const { model, Schema } = require("mongoose"); // Erase if already required
const COLLECTION_NAME = "Shipping";
// Declare the Schema of the Mongo model
const shippingSchema = new Schema(
  {
    shipping_address: {
      type: String,
      required: [true, "Please provide shipping address"],
      maxlength: 50,
    },
    shipping_phoneNumber: {
      type: String,
      maxlength: 20,
    },
    shipping_image: {
      type: String,
    },
    shipping_description: {
      type: String,
      maxlength: 100,
    },
    shipping_shipperId: {
      type: Schema.Types.ObjectId,
      ref: "Shipper",
      required: [true, "Please provide shipper id for shipping"],
    },
    shipping_shipment: {
      type: Schema.Types.Mixed,
      required: [true, "Please provide information of shipper for shipping"],
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = model(COLLECTION_NAME, shippingSchema);

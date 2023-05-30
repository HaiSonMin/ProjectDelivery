
const { model, Schema } = require("mongoose"); // Erase if already required
const COLLECTION_NAME = "Shipper";
// Declare the Schema of the Mongo model
const shipperSchema = new Schema(
  {
    shipper_name: {
      type: String,
      required: [true, "Please provide shipper name"],
      maxlength: 30,
    },
    shipper_info: {
      type: String,
      required: [true, "Please provide shipper info"],
      maxlength: 100,
    },
    shipper_phoneNumber: {
      type: String,
      required: [true, "Please provide shipper phoneNumber"],
      maxlength: 20,
    },
    shipper_image: {
      type: String,
      required: [true, "Please provide shipper image"],
      maxlength: 20,
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = model(COLLECTION_NAME, shipperSchema);

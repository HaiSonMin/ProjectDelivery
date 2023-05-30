const { model, Schema } = require("mongoose"); // Erase if already required
const COLLECTION_NAME = "Site";
// Declare the Schema of the Mongo model
const siteSchema = new Schema(
  {
    site_name: {
      type: String,
      required: [true, "Please provide site name "],
      maxlength: 50,
    },
    site_description: {
      type: String,
      maxlength: 50,
    },
    site_contact_info: {
      type: String,
      maxlength: 50,
    },
    site_address: {
      type: String,
      required: [true, "Please provide address"],
      maxlength: 50,
    },
    site_shopId: {
      type: Schema.Types.ObjectId,
      ref:"Shop",
      required: [true, "Please provide Shop Id"],
    },
  
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = model(COLLECTION_NAME, siteSchema);

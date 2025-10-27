import mongoose from "mongoose";

const logoSettingsSchema = new mongoose.Schema({
  siteLogo: { type: String }, 
  siteIcon: { type: String }, 
  siteTitle: { type: String },
});

const headerSchema = new mongoose.Schema(
  {
    logoSettings: logoSettingsSchema,
    headerImage: { type: String }, 
    vendorLoginButton: {
      text: { type: String, default: "Vendor Login" },
      visible: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Header", headerSchema);

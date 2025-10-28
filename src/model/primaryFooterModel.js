import mongoose from "mongoose";

const socialLinkSchema = new mongoose.Schema({
  platform: { type: String, required: true },
  url: { type: String, required: true }
});

const primaryFooterSchema = new mongoose.Schema(
  {
    logo: { type: String },
    quote: { type: String },
    knowUs: [{ type: String }],
    services: [{ type: String }],
    needToKnow: [{ type: String }],
    socialLinks: [socialLinkSchema],
  },
  { timestamps: true }
);

const PrimaryFooter = mongoose.model("PrimaryFooter", primaryFooterSchema);

export default PrimaryFooter;

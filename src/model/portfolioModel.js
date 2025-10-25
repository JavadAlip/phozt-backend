import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema({
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
  sections: [
    {
      name: { type: String, required: true }, // e.g., Wedding, Birthday
      images: [{ type: String }], // Cloudinary URLs
    },
  ],
}, { timestamps: true });

export default mongoose.model("Portfolio", portfolioSchema);

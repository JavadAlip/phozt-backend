import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  areas: [{ type: String }],
});

const secondaryFooterSchema = new mongoose.Schema({
  city: { type: String, required: true },
  services: [serviceSchema],
}, { timestamps: true });

export default mongoose.model("SecondaryFooter", secondaryFooterSchema);

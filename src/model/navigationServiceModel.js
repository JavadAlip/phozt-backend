import mongoose from "mongoose";

const navigationServiceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    info: { type: String },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("NavigationService", navigationServiceSchema);

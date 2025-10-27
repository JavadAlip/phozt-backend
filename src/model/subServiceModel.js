import mongoose from "mongoose";

const subServiceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    info: { type: String },
    image: { type: String }, 
    navigationService: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NavigationService",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("SubService", subServiceSchema);

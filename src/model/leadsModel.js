import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    contact: { type: String, required: true },
    city: { type: String, required: true },
    requestedService: {
      type: String,
      enum: ["Photography", "Decoration", "Makeup", "Catering"],
      required: true,
    },
    eventDate: { type: Date, required: true },
    eventBudget: { type: String, required: true },
    message: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Lead", leadSchema);

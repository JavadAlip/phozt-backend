import mongoose from "mongoose";

const vendorGroupSchema = new mongoose.Schema({
  groupName: { type: String, required: true },
  mainService: {
    type: String,
    enum: ["Photography", "Decoration", "Makeup", "Catering"],
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vendor" }],
  assignedLeads: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lead" }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
}, { timestamps: true });

export default mongoose.model("VendorGroup", vendorGroupSchema);

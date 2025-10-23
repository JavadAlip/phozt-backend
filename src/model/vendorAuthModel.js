import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const vendorSchema = new mongoose.Schema({
  businessName: { type: String, required: true },
  city: { type: String, required: true },
  vendorType: {
    type: String,
    enum: ["Photography", "Decoration", "Makeup", "Catering"],
    required: true,
  },
  mobile: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // OTP fields
  otp: { type: String },
  otpExpiresAt: { type: Date },
  lastOtpSent: { type: Date }, // For resend limit
}, { timestamps: true });

// Hash password before saving
vendorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export default mongoose.model("Vendor", vendorSchema);

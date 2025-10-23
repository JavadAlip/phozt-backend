import Vendor from "../../model/vendorAuthModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendEmail } from "../../utils/sendEmail.js";

dotenv.config();

// Register Vendor
export const registerVendor = async (req, res) => {
  try {
    const { businessName, city, vendorType, mobile, email, password } = req.body;

    const existingVendor = await Vendor.findOne({ $or: [{ email }, { mobile }] });
    if (existingVendor) {
      return res.status(400).json({ message: "Vendor already exists." });
    }

    const vendor = new Vendor({ businessName, city, vendorType, mobile, email, password });
    await vendor.save();

    res.status(201).json({ message: "Vendor registered successfully", vendor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Send / Resend OTP
export const sendVendorOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const vendor = await Vendor.findOne({ email });
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    //Limit OTP resend to 10 second
    const now = Date.now();
    if (vendor.lastOtpSent && now - vendor.lastOtpSent.getTime() < 10 * 1000) {
      return res.status(429).json({ message: "Please wait 10 seconds before requesting OTP again" });
    }


    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    vendor.otp = otp;
    vendor.otpExpiresAt = new Date(Date.now() + 2 * 60 * 1000);
    vendor.lastOtpSent = new Date();

    await vendor.save();

    await sendEmail(email, "Phozt Vendor Email Verification OTP", `Your OTP is ${otp}. Valid for 2 minutes.`);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Verify OTP
export const verifyVendorOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const vendor = await Vendor.findOne({ email });
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    if (vendor.otp !== otp || vendor.otpExpiresAt < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Reset OTP fields
    vendor.otp = null;
    vendor.otpExpiresAt = null;
    vendor.lastOtpSent = null;
    await vendor.save();

    // Generate JWT token
    const token = jwt.sign(
      { vendorId: vendor._id, email: vendor.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "OTP verified successfully", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

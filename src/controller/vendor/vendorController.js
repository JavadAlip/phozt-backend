import Vendor from "../../model/vendorAuthModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendEmail } from "../../utils/sendEmail.js";
import VendorGroup from "../../model/vendorGroupModel.js";
import Lead from "../../model/leadsModel.js";

dotenv.config();

// register-vendor
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


// send / resend OTP
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


// verify-OTP
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


// get-vendor-profile
export const getVendorProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.vendor._id).select(
      "-password -otp -otpExpiresAt -lastOtpSent"
    );

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.status(200).json({ vendor });
  } catch (error) {
    console.error("Error fetching vendor profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// update-vendor-profile
export const updateVendorProfile = async (req, res) => {
  try {
    const vendorId = req.vendor.vendorId;
    const updateData = req.body;

    // Update only allowed fields
    const allowedFields = ["contactPersonName", "whatsappNumber", "address", "facebookLink", "instagramLink", "youtubeLink", "businessName", "city", "mobile"];
    const filteredData = {};
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) filteredData[field] = updateData[field];
    });

    const updatedVendor = await Vendor.findByIdAndUpdate(vendorId, filteredData, { new: true }).select("-password -otp -otpExpiresAt -lastOtpSent");

    res.status(200).json({ message: "Profile updated successfully", vendor: updatedVendor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// fetch vendor leads
export const getVendorLeads = async (req, res) => {
  try {
    const vendorId = req.vendor._id;

    // Find all groups where this vendor is a member
    const groups = await VendorGroup.find({ members: vendorId }).populate("assignedLeads");

    if (!groups.length) {
      return res.status(404).json({ message: "Vendor is not part of any group" });
    }

    // Combine all leads from all groups into one array
    const allLeads = groups.flatMap(group => group.assignedLeads);

    if (!allLeads.length) {
      return res.status(404).json({ message: "No assigned leads found", leads: [] });
    }

    res.status(200).json({
      message: "Assigned leads fetched successfully",
      leads: allLeads,
    });
  } catch (error) {
    console.error("Error fetching vendor leads:", error);
    res.status(500).json({ message: "Error fetching assigned leads", error: error.message });
  }
};
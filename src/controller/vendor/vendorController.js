import Vendor from "../../model/vendorAuthModel.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

// Register
export const registerVendor = async (req, res) => {
  try {
    const { businessName, city, vendorType, mobile, email, password } = req.body;

    // Check if vendor exists
    const existingVendor = await Vendor.findOne({ $or: [{ email }, { mobile }] });
    if (existingVendor) {
      return res.status(400).json({ message: "Vendor with this email or mobile already exists." });
    }

    // Create vendor
    const vendor = new Vendor({ businessName, city, vendorType, mobile, email, password });
    await vendor.save();

    // Generate JWT token
    const token = jwt.sign(
      { vendorId: vendor._id, businessName: vendor.businessName, email: vendor.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ message: "Vendor registered successfully", vendor, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

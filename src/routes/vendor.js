import express from "express";
import { registerVendor, sendVendorOtp, verifyVendorOtp } from "../controller/vendor/vendorController.js";
import { vendorAuth } from "../middleware/vendorAuth.js";

const router = express.Router();

router.post("/vendor-register", registerVendor);
router.post("/vendor-send-otp", sendVendorOtp);     
router.post("/vendor-verify-otp", verifyVendorOtp);   

// Example protected route
router.get("/vendor-dashboard", vendorAuth, (req, res) => {
  res.json({ message: `Welcome Vendor ${req.vendor.email}` });
});

export default router;

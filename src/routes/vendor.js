import express from "express";
import { registerVendor, sendVendorOtp, verifyVendorOtp, getVendorProfile, updateVendorProfile, getVendorLeads } from "../controller/vendor/vendorController.js";
import { addPortfolioImage, getVendorPortfolio } from "../controller/vendor/portfolioController.js";
import { vendorAuth } from "../middleware/vendorAuth.js";
import upload from "../middleware/upload.js";

const router = express.Router();
//✅ means successfully worked on postman

router.post("/vendor-register", registerVendor); //✅
router.post("/vendor-send-otp", sendVendorOtp); //✅
router.post("/vendor-verify-otp", verifyVendorOtp); //✅
router.get("/get-vendor-profile", vendorAuth, getVendorProfile); //✅
router.put("/update-vendor-profile", vendorAuth, updateVendorProfile); //✅
router.get("/assigned-leads", vendorAuth, getVendorLeads); //✅
router.post("/portfolio/image", vendorAuth, upload.single("file"), addPortfolioImage); //✅
router.get("/portfolio", vendorAuth, getVendorPortfolio);//✅


// Example protected route
router.get("/vendor-dashboard", vendorAuth, (req, res) => {
    res.json({ message: `Welcome Vendor ${req.vendor.email}` });
});

export default router;

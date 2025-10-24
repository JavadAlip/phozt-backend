import express from "express";
import { adminLogin, assignLeadToGroup } from "../controller/admin/adminController.js";
import { getVendorsByService, createVendorGroup, getAllVendorGroups, removeMemberFromGroup, addVendorToGroup, deleteVendorGroup } from "../controller/admin/vendorGroupController.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { createLead, getLeadById, getAllLeads, deleteLead } from "../controller/leads/leadController.js";

const router = express.Router();
//✅ means successfully worked on postman

// Admin login 
router.post("/admin-login", adminLogin); //✅
router.post("/assign-lead", adminAuth, assignLeadToGroup); 

//lead
router.post("/create-lead", adminAuth, createLead); //✅
router.get("/lead/:id", adminAuth, getLeadById); //✅
router.get("/all-leads", adminAuth, getAllLeads); //✅
router.delete("/delete-lead/:id", adminAuth, deleteLead); //✅

//vendor
router.post("/create-vendor-group", adminAuth, createVendorGroup); //✅
router.get("/vendors-list", adminAuth, getVendorsByService); //✅
router.get("/all-vendor-groups", adminAuth, getAllVendorGroups); //✅
router.delete("/vendor-groups/:groupId/dlt-member/:vendorId", adminAuth, removeMemberFromGroup); //✅
router.post("/vendor-groups/:groupId/add-member/:vendorId", adminAuth, addVendorToGroup); //✅
router.delete("/vendor-groups/:groupId", adminAuth, deleteVendorGroup); //✅




// Protected admin dashboard route
router.get("/dashboard", adminAuth, (req, res) => {
    res.json({ message: "Welcome to the admin dashboard", admin: req.admin });
});

export default router;

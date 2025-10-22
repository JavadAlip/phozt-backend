import express from "express";
import { adminLogin } from "../controller/admin/adminController.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { createLead,getLeadById, getAllLeads, deleteLead } from "../controller/leads/leadController.js";

const router = express.Router();

// Admin login route
router.post("/admin-login", adminLogin);

//lead
router.post("/create-lead", adminAuth, createLead);
router.get("/lead/:id", adminAuth, getLeadById);
router.get("/all-leads", adminAuth, getAllLeads);
router.delete("/delete-lead/:id", adminAuth, deleteLead);


// Protected admin dashboard route
router.get("/dashboard", adminAuth, (req, res) => {
    res.json({ message: "Welcome to the admin dashboard", admin: req.admin });
});

export default router;

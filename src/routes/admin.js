import express from "express";
import { adminLogin } from "../controller/admin/adminController.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

// Admin login route
router.post("/admin-login", adminLogin);

// Protected admin dashboard route
router.get("/dashboard", adminAuth, (req, res) => {
  res.json({ message: "Welcome to the admin dashboard", admin: req.admin });
});

export default router;

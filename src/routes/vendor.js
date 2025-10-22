
import express from "express";
import { registerVendor} from "../controller/vendor/vendorController.js";
import { vendorAuth } from "../middleware/vendorAuth.js";

const router = express.Router();

// Routes
router.post("/vendor-register", registerVendor);

export default router;

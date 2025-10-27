import express from "express";
import multer from "multer";
import { adminAuth } from "../middleware/adminAuth.js";
import { createNavigationService, createSubService, getAllNavigationWithSubServices } from "../controller/Header/navigationController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
router.post("/navigation-create", adminAuth, createNavigationService);
router.post("/subservice-create", adminAuth, upload.single("image"), createSubService);
router.get("/navigation-full", getAllNavigationWithSubServices);

export default router;

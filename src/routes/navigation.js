import express from "express";
import multer from "multer";
import { adminAuth } from "../middleware/adminAuth.js";
import { createNavigationService, createSubService, getAllNavigationServices, getAllSubServices, getAllNavigationWithSubServices, updateNavigationService, updateSubService, deleteNavigationService, deleteSubService } from "../controller/Header/navigationController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

//navigation
router.post("/navigation-create", adminAuth, createNavigationService); //✅ 
router.get("/navigation-get-all", adminAuth, getAllNavigationServices); //✅ 
router.put("/navigation-update/:id", adminAuth, updateNavigationService); //✅ 
router.delete("/navigation-delete/:id", adminAuth, deleteNavigationService); //✅ 

//subservice
router.post("/subservice-create", adminAuth, upload.single("image"), createSubService); //✅ 
router.get("/subservice-get-all", adminAuth, getAllSubServices); //✅ 
router.put("/subservice-update/:id", adminAuth, upload.single("image"), updateSubService); //✅ 
router.delete("/subservice-delete/:id", adminAuth, deleteSubService); //✅ 

//compined
router.get("/navigation-full", adminAuth, getAllNavigationWithSubServices); //✅ 

export default router;

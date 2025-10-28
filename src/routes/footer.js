import express from "express";
import multer from "multer";
import { adminAuth } from "../middleware/adminAuth.js";
import { upsertPrimaryFooter, getPrimaryFooter, deletePrimaryFooter, updatePrimaryFooterField, deleteFooterItem, createSecondaryFooter, getAllSecondaryFooters, editSecondaryFooter, deleteSecondaryFooter } from "../controller/footer/footerController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

//primary-ooter
router.post("/create-primary-footer", adminAuth, upload.single("logo"), upsertPrimaryFooter); //✅ 
router.get("/get-primary-footer", adminAuth, getPrimaryFooter); //✅ 
router.delete("/delete-primary-footer", adminAuth, deletePrimaryFooter); //✅ 
router.patch("/primary-update-field", adminAuth, updatePrimaryFooterField); //✅ 
router.delete("/primary-delete-field/:section/:value", deleteFooterItem); //✅ 


//secondary-footer
router.post("/create-secondary-footer", adminAuth, createSecondaryFooter); //✅ 
router.get("/get-secondary-footer", adminAuth, getAllSecondaryFooters); //✅ 
router.put("/update-secondary-footer/:id", adminAuth, editSecondaryFooter); //✅ 
router.delete("/delete-secondary-footer/:id", adminAuth, deleteSecondaryFooter); //✅ 

export default router;

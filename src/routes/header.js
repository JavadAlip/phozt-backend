import express from "express";
import multer from "multer";
import { upsertHeader, getHeader } from "../controller/Header/headerController.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  "/header",
  adminAuth,
  upload.fields([
    { name: "siteLogo", maxCount: 1 },
    { name: "siteIcon", maxCount: 1 },
    { name: "headerImage", maxCount: 1 },
  ]),
  upsertHeader
);

router.get("/header", adminAuth, getHeader);

export default router;

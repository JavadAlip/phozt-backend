import multer from "multer";

// Use memory storage for Cloudinary streaming
const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;

import Portfolio from "../../model/portfolioModel.js";
import { uploadImageToCloudinary } from "../../config/cloudinaryUpload.js";

// Add image to portfolio
export const addPortfolioImage = async (req, res) => {
  try {
    const vendorId = req.vendor._id; // logged-in vendor
    const { sectionName } = req.body;
    const file = req.file;

    if (!sectionName || !file) {
      return res.status(400).json({ message: "Section name and image file are required" });
    }

    // Upload image to Cloudinary
    const result = await uploadImageToCloudinary(file.buffer, `portfolio/${vendorId}/${sectionName}`);

    // Find or create vendor portfolio
    let portfolio = await Portfolio.findOne({ vendor: vendorId });
    if (!portfolio) {
      portfolio = new Portfolio({
        vendor: vendorId,
        sections: [{ name: sectionName, images: [result.secure_url] }],
      });
    } else {
      // Check if section exists
      const sectionIndex = portfolio.sections.findIndex(s => s.name === sectionName);
      if (sectionIndex === -1) {
        portfolio.sections.push({ name: sectionName, images: [result.secure_url] });
      } else {
        portfolio.sections[sectionIndex].images.push(result.secure_url);
      }
    }

    await portfolio.save();

    res.status(200).json({
      message: "Image added to portfolio",
      portfolio,
    });
  } catch (error) {
    console.error("Portfolio image error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get vendor portfolio
export const getVendorPortfolio = async (req, res) => {
  try {
    const vendorId = req.vendor._id;
    const portfolio = await Portfolio.findOne({ vendor: vendorId });
    if (!portfolio) return res.status(404).json({ message: "No portfolio found" });

    res.status(200).json({ message: "Portfolio fetched", portfolio });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

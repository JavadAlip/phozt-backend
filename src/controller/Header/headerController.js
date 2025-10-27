import Header from "../../model/headerModel.js";
import { uploadImageToCloudinary } from "../../config/cloudinaryUpload.js";

// create-header
export const upsertHeader = async (req, res) => {
  try {
    let { logoSettings, vendorLoginButton } = req.body;

    // Parse text JSON data safely
    logoSettings = logoSettings ? JSON.parse(logoSettings) : {};
    vendorLoginButton = vendorLoginButton ? JSON.parse(vendorLoginButton) : {};

    // Initialize image URLs
    let siteLogoUrl = logoSettings.siteLogo || "";
    let siteIconUrl = logoSettings.siteIcon || "";
    let headerImageUrl = null;

    // Upload images if provided
    if (req.files?.siteLogo?.[0]) {
      const result = await uploadImageToCloudinary(
        req.files.siteLogo[0].buffer,
        "header/logo"
      );
      siteLogoUrl = result.secure_url;
    }

    if (req.files?.siteIcon?.[0]) {
      const result = await uploadImageToCloudinary(
        req.files.siteIcon[0].buffer,
        "header/icon"
      );
      siteIconUrl = result.secure_url;
    }

    if (req.files?.headerImage?.[0]) {
      const result = await uploadImageToCloudinary(
        req.files.headerImage[0].buffer,
        "header/image"
      );
      headerImageUrl = result.secure_url;
    }

    // Update final object
    const data = {
      logoSettings: {
        ...logoSettings,
        siteLogo: siteLogoUrl,
        siteIcon: siteIconUrl,
      },
      vendorLoginButton,
    };

    if (headerImageUrl) data.headerImage = headerImageUrl;

    // Upsert (create or update)
    const updatedHeader = await Header.findOneAndUpdate({}, data, {
      new: true,
      upsert: true,
    });

    res.status(200).json({
      success: true,
      message: "Header data saved successfully",
      data: updatedHeader,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//get-header
export const getHeader = async (req, res) => {
  try {
    const header = await Header.findOne();
    res.status(200).json({ success: true, data: header });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

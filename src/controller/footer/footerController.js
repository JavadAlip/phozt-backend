import PrimaryFooter from "../../model/primaryFooterModel.js";
import SecondaryFooter from "../../model/secondaryFooterModel.js";
import { uploadImageToCloudinary } from "../../config/cloudinaryUpload.js";


// ======== PRIMARY FOOTER ========

// Create or update (Upsert)
export const upsertPrimaryFooter = async (req, res) => {
    try {
        let imageUrl = "";
        if (req.file) {
            const upload = await uploadImageToCloudinary(req.file.buffer, "footer");
            imageUrl = upload.secure_url;
        }

        // Parse JSON string fields if they exist
        const parsedBody = {
            ...req.body,
            knowUs: req.body.knowUs ? JSON.parse(req.body.knowUs) : [],
            services: req.body.services ? JSON.parse(req.body.services) : [],
            needToKnow: req.body.needToKnow ? JSON.parse(req.body.needToKnow) : [],
            socialLinks: req.body.socialLinks ? JSON.parse(req.body.socialLinks) : [],
        };
        let updated;

        const existingFooter = await PrimaryFooter.findOne();

        if (existingFooter) {
            // Update existing footer
            updated = await PrimaryFooter.findByIdAndUpdate(
                existingFooter._id,
                {
                    ...parsedBody,
                    ...(imageUrl && { logo: imageUrl }),
                },
                { new: true }
            );
        } else {
            // Create new footer if none exists
            updated = await PrimaryFooter.create({
                ...parsedBody,
                ...(imageUrl && { logo: imageUrl }),
            });
        }

        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// Get
export const getPrimaryFooter = async (req, res) => {
    try {
        const footer = await PrimaryFooter.findOne();
        res.status(200).json({ success: true, data: footer });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// Delete
export const deletePrimaryFooter = async (req, res) => {
    try {
        await PrimaryFooter.deleteMany();
        res.status(200).json({ success: true, message: "Primary footer deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// Patch - Update only a specific field
export const updatePrimaryFooterField = async (req, res) => {
  try {
    const footer = await PrimaryFooter.findOne();
    if (!footer) {
      return res.status(404).json({ success: false, message: "Primary footer not found" });
    }

    const { field, value } = req.body;

    if (!field || value === undefined) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide field and value to update" });
    }

    if (Array.isArray(footer[field])) {
      footer[field].push(value); 
    } else {
      footer[field] = value;
    }

    await footer.save();
    res.status(200).json({ success: true, data: footer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Delete - delete only a specific field
export const deleteFooterItem = async (req, res) => {
  try {
    const { section, value } = req.params; 
    //section = "services", value = "Photography"

    const validSections = ["services", "needToKnow", "knowUs", "socialLinks"];
    if (!validSections.includes(section)) {
      return res.status(400).json({
        success: false,
        message: "Invalid section name. Use one of: services, needToKnow, knowUs, socialLinks",
      });
    }

    const footer = await PrimaryFooter.findOne();
    if (!footer) {
      return res.status(404).json({ success: false, message: "Primary footer not found" });
    }

    if (section === "socialLinks") {
      footer.socialLinks = footer.socialLinks.filter(
        (link) => link.platform.toLowerCase() !== value.toLowerCase()
      );
    } else {
      footer[section] = footer[section].filter(
        (item) => item.toLowerCase() !== value.toLowerCase()
      );
    }

    await footer.save();

    res.status(200).json({
      success: true,
      message: `"${value}" removed from ${section}`,
      data: footer,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// ======== SECONDARY FOOTER ========

//create-city-footer
export const createSecondaryFooter = async (req, res) => {
    try {
        const data = await SecondaryFooter.create(req.body);
        res.status(200).json({ success: true, message: "Secondary footer created", data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


//get-all-cities-with-services
export const getAllSecondaryFooters = async (req, res) => {
    try {
        const data = await SecondaryFooter.find();
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


//edit-city-footer (update services/areas)
export const editSecondaryFooter = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await SecondaryFooter.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({ success: true, message: "City footer updated", data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


//delete-city-footer
export const deleteSecondaryFooter = async (req, res) => {
    try {
        const { id } = req.params;
        await SecondaryFooter.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "City footer deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

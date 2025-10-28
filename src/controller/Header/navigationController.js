import NavigationService from "../../model/navigationServiceModel.js";
import SubService from "../../model/subServiceModel.js";
import { uploadImageToCloudinary } from "../../config/cloudinaryUpload.js";


//create-navigation-service
export const createNavigationService = async (req, res) => {
  try {
    const newNav = await NavigationService.create(req.body);
    res.status(200).json({ success: true, message: "Navigation created", data: newNav });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


//create-subserivce 
export const createSubService = async (req, res) => {
  try {
    let imageUrl = "";

    if (req.file) {
      const upload = await uploadImageToCloudinary(req.file.buffer, "subServices");
      imageUrl = upload.secure_url;
    }

    const subService = await SubService.create({
      ...req.body,
      image: imageUrl,
    });

    res.status(200).json({
      success: true,
      message: "Sub-service added successfully",
      data: subService,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


//get-all-navigation-services
export const getAllNavigationServices = async (req, res) => {
  try {
    const navs = await NavigationService.find();
    res.status(200).json({ success: true, data: navs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


//get-all-sub-services
export const getAllSubServices = async (req, res) => {
  try {
    const subs = await SubService.find().populate("navigationService", "title");
    res.status(200).json({ success: true, data: subs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


//get-full-naviagtion-details
export const getAllNavigationWithSubServices = async (req, res) => {
  try {
    const data = await NavigationService.find().lean();

    const populated = await Promise.all(
      data.map(async (nav) => {
        const subServices = await SubService.find({ navigationService: nav._id });
        return { ...nav, subServices };
      })
    );

    res.status(200).json({
      success: true,
      data: populated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


//update-navigation-service
export const updateNavigationService = async (req, res) => {
  try {
    const updated = await NavigationService.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Navigation not found" });

    res.status(200).json({ success: true, message: "Navigation updated", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}; 


//update-sub-service
export const updateSubService = async (req, res) => {
  try {
    let updateData = { ...req.body };

    if (req.file) {
      const upload = await uploadImageToCloudinary(req.file.buffer, "subServices");
      updateData.image = upload.secure_url;
    }

    const updated = await SubService.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Sub-service not found" });

    res.status(200).json({ success: true, message: "Sub-service updated", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


//delete-navigation-service
export const deleteNavigationService = async (req, res) => {
  try {
    const deleted = await NavigationService.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Navigation not found" });

    // Optionally delete subservices linked to this navigation
    await SubService.deleteMany({ navigationService: req.params.id });

    res.status(200).json({ success: true, message: "Navigation and its sub-services deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


//delete-sub-service
export const deleteSubService = async (req, res) => {
  try {
    const deleted = await SubService.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Sub-service not found" });

    res.status(200).json({ success: true, message: "Sub-service deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
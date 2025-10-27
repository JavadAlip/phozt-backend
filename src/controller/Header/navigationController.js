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

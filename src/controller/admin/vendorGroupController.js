import VendorGroup from "../../model/vendorGroupModel.js";
import Vendor from "../../model/vendorAuthModel.js";

//create-vendor-group
export const createVendorGroup = async (req, res) => {
  try {
    const { groupName, mainService, memberIds } = req.body;

    if (!groupName || !mainService || !memberIds || !memberIds.length) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if all selected vendors belong to the chosen mainService
    const validVendors = await Vendor.find({
      _id: { $in: memberIds },
      vendorType: mainService,
    });

    if (validVendors.length !== memberIds.length) {
      return res.status(400).json({ message: "Some vendors do not match the selected service" });
    }

    // Create group
    const group = new VendorGroup({
      groupName,
      mainService,
      members: memberIds,
      createdBy: req.admin._id,
    });

    await group.save();

    // Populate members to include businessName and contactPersonName
    const populatedGroup = await VendorGroup.findById(group._id).populate({
      path: "members",
      select: "businessName contactPersonName email mobile", 
    });

    res.status(201).json({ message: "Vendor group created successfully", group: populatedGroup });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// get-vendors-by-service
export const getVendorsByService = async (req, res) => {
  try {
    const { service } = req.query;
    if (!service) {
      return res.status(400).json({ message: "Service query parameter is required" });
    }

    const vendors = await Vendor.find({ vendorType: service }).select(
      "_id businessName email mobile"
    );

    res.status(200).json(vendors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// Get-all-vendor-groups
export const getAllVendorGroups = async (req, res) => {
  try {
    const groups = await VendorGroup.find()
      .populate({
        path: "members",
        select: "businessName contactPersonName email mobile", 
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ message: "Vendor groups fetched successfully", groups });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// Remove-member-from-group
export const removeMemberFromGroup = async (req, res) => {
  try {
    const { groupId, vendorId } = req.params;

    // Find and update group by removing vendorId from members array
    const updatedGroup = await VendorGroup.findByIdAndUpdate(
      groupId,
      { $pull: { members: vendorId } }, 
      { new: true }
    ).populate({
      path: "members",
      select: "businessName contactPersonName email mobile"
    });

    if (!updatedGroup) {
      return res.status(404).json({ message: "Vendor group not found" });
    }

    res.status(200).json({
      message: "Vendor removed from group successfully",
      group: updatedGroup,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// add-member-to-group
export const addVendorToGroup = async (req, res) => {
  try {
    const { groupId, vendorId } = req.params;

    // Find group
    const group = await VendorGroup.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    // Find vendor
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    // Validate service type match
    if (vendor.vendorType.toLowerCase() !== group.mainService.toLowerCase()) {
      return res.status(400).json({
        message: `Vendor type mismatch. Only ${group.mainService} vendors can be added to this group.`,
      });
    }

    // Check if vendor already in group
    const alreadyMember = group.members.some(
      (id) => id.toString() === vendorId
    );
    if (alreadyMember) {
      return res
        .status(400)
        .json({ message: "Vendor already added to this group" });
    }

    // Add vendor ID to members list
    group.members.push(vendor._id);
    await group.save();

    // Populate vendor details before sending response
    const populatedGroup = await VendorGroup.findById(group._id).populate({
      path: "members",
      select: "businessName contactPersonName mobile email vendorType",
    });

    res.status(200).json({
      message: "Vendor added to group successfully",
      group: populatedGroup,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding vendor to group",
      error: error.message,
    });
  }
};


// delete-vendor-group
export const deleteVendorGroup = async (req, res) => {
  try {
    const { groupId } = req.params;

    // Check if group exists
    const group = await VendorGroup.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Vendor group not found" });
    }

    // Delete group
    await VendorGroup.findByIdAndDelete(groupId);

    res.status(200).json({ message: "Vendor group deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting vendor group",
      error: error.message,
    });
  }
};


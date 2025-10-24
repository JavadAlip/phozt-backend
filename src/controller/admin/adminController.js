import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();
import VendorGroup from "../../model/vendorGroupModel.js";
import Lead from "../../model/leadsModel.js";
import { sendWhatsappMessage } from "../../utils/sendWhatsapp.js";

export const adminLogin = (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ message: "Identifier and password required" });
  }

  if (
    (identifier === process.env.ADMIN_EMAIL || identifier === process.env.ADMIN_USERNAME) &&
    password === process.env.ADMIN_PASSWORD
  ) {
    // Generate JWT token
    const token = jwt.sign(
      { admin: true, identifier },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ message: "Admin login successful", token });
  } else {
    return res.status(401).json({ message: "Invalid admin credentials" });
  }
};


// assingn lead to vendor group members
export const assignLeadToGroup = async (req, res) => {
  try {
    const { groupId, leadId } = req.body;

    // Fetch group with full vendor details
    const group = await VendorGroup.findById(groupId).populate("members");
    if (!group) return res.status(404).json({ message: "Vendor group not found" });

    // Fetch lead details
    const lead = await Lead.findById(leadId);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    console.log(` Assigning lead to group: ${group.groupName}`);
    console.log(` Group members:`, group.members);

    // Send WhatsApp message to each member
    const sendMessages = group.members.map(async (member) => {
      if (!member.mobile) {
        console.warn(` Member ${member._id} (${member.businessName}) has no mobile number`);
        return;
      }

      const message = ` New Lead Assigned!

 Lead ID: ${lead._id}
 Name: ${lead.name}
 Contact: ${lead.contact}
 City: ${lead.city}
 Service: ${lead.requestedService}
 Event Date: ${new Date(lead.eventDate).toLocaleString()}
 Budget: ${lead.eventBudget}
 Message: ${lead.message}
 Assigned to: ${member.businessName}
 Time: ${new Date().toLocaleString()}

Please follow up as soon as possible.`;

      await sendWhatsappMessage(member.mobile, message);
    });

    await Promise.all(sendMessages);

    // Add the lead ID to assignedLeads if not already added
    if (!group.assignedLeads) group.assignedLeads = [];
    if (!group.assignedLeads.includes(lead._id)) {
      group.assignedLeads.push(lead._id);
      await group.save();
    }

    res.status(200).json({
      message: "Lead assigned successfully — WhatsApp messages sent to group members.",
      group,
    });

  } catch (error) {
    console.error(" Error assigning lead:", error);
    res.status(500).json({ message: "Error assigning lead", error: error.message });
  }
};

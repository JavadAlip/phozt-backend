import Lead from "../../model/leadsModel.js";

//create-new-lead
export const createLead = async (req, res) => {
  try {
    const { name, contact, city, requestedService, eventDate, eventBudget, message } = req.body;

    if (!name || !contact || !city || !requestedService || !eventDate || !eventBudget) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const lead = new Lead({
      name,
      contact,
      city,
      requestedService,
      eventDate,
      eventBudget,
      message,
    });

    await lead.save();

    res.status(201).json({ message: "Lead created successfully", lead });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//get-a-specific-lead
export const getLeadById = async (req, res) => {
  try {
    const { id } = req.params;

    const lead = await Lead.findById(id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.status(200).json({ message: "Lead fetched successfully", lead });
  } catch (error) {
    console.error(" Error fetching lead:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//get-all-leads
export const getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 }); 
    res.status(200).json({ message: "Leads fetched successfully", leads });
  } catch (error) {
    console.error(" Error fetching leads:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//delete-lead
export const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;

    const lead = await Lead.findByIdAndDelete(id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.status(200).json({ message: "Lead deleted successfully" });
  } catch (error) {
    console.error(" Error deleting lead:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

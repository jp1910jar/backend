const express = require("express");
const router = express.Router();
const CrmData = require("../models/CrmData");

// 1. Create CRM
router.post("/createCrm", async (req, res) => {
  try {
    if (req.body.id) delete req.body.id; // prevent user from setting id
    const crm = new CrmData(req.body);
    await crm.save();
    res.status(201).json(crm);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Update CRM by auto-increment id (not _id)
router.put("/updateCrm/:id", async (req, res) => {
  try {
    const crm = await CrmData.findOneAndUpdate(
      { id: req.params.id }, // match by auto-increment id
      req.body,
      { new: true }
    );
    if (!crm) return res.status(404).json({ message: "CRM not found" });
    res.json(crm);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Get Leads
router.get("/getCrmLead", async (req, res) => {
  try {
    const leads = await CrmData.find({ type: "Lead" });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Get Deals
router.get("/getCrmDeal", async (req, res) => {
  try {
    const deals = await CrmData.find({ type: "Deal" });
    res.json(deals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Update Type (Lead → Deal) by id
router.put("/updateType/:id", async (req, res) => {
  try {
    const crm = await CrmData.findOneAndUpdate(
      { id: req.params.id },
      { type: "Deal" },
      { new: true }
    );
    if (!crm) return res.status(404).json({ message: "CRM not found" });
    res.json(crm);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.delete("/deleteCrm/:id", async (req, res) => {
  try {
    const crm = await CrmData.findOneAndDelete({ id: req.params.id });
    if (!crm) return res.status(404).json({ message: "CRM not found" });

    res.json({ success: true, message: "Sale deleted" });
  } catch (error) {
    console.error("Delete Crm Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;

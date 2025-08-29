import mongoose from "mongoose";

const crmSchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  state: { type: String, required: true },
  phone: { type: String, required: true },
  type: { type: String, enum: ["Lead", "Deal"], default: "Lead" }, // ✅ Important
}, { timestamps: true });

export default mongoose.model("Crm", crmSchema);

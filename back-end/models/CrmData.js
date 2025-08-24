const mongoose = require("mongoose");
const AutoIncrementFactory = require("mongoose-sequence"); // use require not import

const AutoIncrement = AutoIncrementFactory(mongoose);

const crmSchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  state: { type: String, required: true },

  type: { type: String, enum: ["Lead", "Deal"], default: "Lead" },
  createdAt: { type: Date, default: Date.now },
});

// Auto-increment ID (separate from MongoDB _id)
crmSchema.plugin(AutoIncrement, { inc_field: "id" });

module.exports = mongoose.model("Crm", crmSchema);

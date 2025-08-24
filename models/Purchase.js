import mongoose from "mongoose";

const PurchaseSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  supplier: {
    type: String,
    required: true,
    trim: true,
  },
  product: {
    type: String,
    required: true,
    trim: true,
  },
  qty: {
    type: Number,
    required: true,
    min: 1,
  },
  mip: {
    type: Number,
    required: true,
    min: 0,
  },
  totalMIP: {
    type: Number,
    default: 0,
  },
});

// ✅ Pre-save hook to calculate totalMIP before saving
PurchaseSchema.pre("save", function (next) {
  this.totalMIP = this.qty * this.mip;
  next();
});

export default mongoose.model("Purchase", PurchaseSchema);

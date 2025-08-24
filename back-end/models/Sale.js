import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const saleSchema = new mongoose.Schema(
  {
    saleId: { type: Number, unique: true }, // auto incremented id
    date: { type: Date, required: true },
    customer: { type: String, required: true },
    productSku: { type: String, required: true }, // store SKU not ObjectId
    qty: { type: Number, required: true, min: 1 },
    mdp: { type: Number, required: true, min: 0 }, // selling price (per unit)
    totalMdp: { type: Number }, // qty * mdp
  },
  { timestamps: true }
);

// Auto-increment saleId
const AutoIncrement = AutoIncrementFactory(mongoose);
saleSchema.plugin(AutoIncrement, { inc_field: "saleId" });

// Pre-save hook to calculate totalMdp
saleSchema.pre("save", function (next) {
  this.totalMdp = this.qty * this.mdp;
  next();
});

export default mongoose.models.Sale || mongoose.model("Sale", saleSchema);

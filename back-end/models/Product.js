import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  image: { type: String }, // file path like "/uploads/filename.jpg"
});

export default mongoose.model("Product", ProductSchema);

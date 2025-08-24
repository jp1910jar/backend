import express from "express";
import Product from "../models/Product.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// Multer setup for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// 📌 Create Product with image
router.post("/create", upload.single("image"), async (req, res) => {
  try {
    const { name, sku, quantity, price } = req.body;

    // check SKU duplicate
    const existingProduct = await Product.findOne({ sku });
    if (existingProduct) {
      return res.status(400).json({ success: false, message: "SKU already exists" });
    }

    const product = new Product({
      name,
      sku,
      quantity,
      price,
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await product.save();
    res.status(201).json({ success: true, message: "Product created", product });
  } catch (err) {
    console.error("Product Create Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 📌 Get All Products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ success: true, products });
  } catch (err) {
    console.error("Get Products Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// DELETE /api/products/sku/:sku
router.delete("/:sku", async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ sku: req.params.sku });

    if (!product) return res.status(404).json({ error: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting product" });
  }
});


// PUT /api/products/sku/:sku
router.put("/:sku", upload.single("image"), async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      sku: req.body.sku,
      quantity: req.body.quantity,
      price: req.body.price,
    };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const product = await Product.findOneAndUpdate(
      { sku: req.params.sku },
      updateData,
      { new: true }
    );

    if (!product) return res.status(404).json({ error: "Product not found" });

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Error updating product" });
  }
});

export default router;

import express from "express";
import Sale from "../models/Sale.js";
import Product from "../models/Product.js";

const router = express.Router();

/**
 * GET all sales
 */
router.get("/getSales", async (req, res) => {
  try {
    const sales = await Sale.find();

    const enriched = await Promise.all(
      sales.map(async (s) => {
        const product = await Product.findOne({ sku: s.productSku });
        return {
          ...s.toObject(),
          productName: product ? product.name : null,
          productPrice: product ? product.price : null,
        };
      })
    );

    res.json({ success: true, sales: enriched });
  } catch (error) {
    console.error("Get Sales Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * CREATE Sale
 */
router.post("/createSale", async (req, res) => {
  try {
    const { date, customer, productSku, qty, mdp } = req.body; 
    const product = await Product.findOne({ sku: productSku });
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    if (product.quantity < qty) {
      return res.status(400).json({ success: false, message: "Not enough stock" });
    }

    // reduce stock
    product.quantity -= qty;
    await product.save();

    const sale = new Sale({ date, customer, productSku, qty, mdp });
    await sale.save();

    res.status(201).json({ success: true, message: "Sale recorded", sale });
  } catch (error) {
    console.error("Create Sale Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * UPDATE Sale by saleId
 */
router.put("/updateSale/:saleId", async (req, res) => {
  try {
    const { date, customer, productSku, qty, mdp } = req.body;

    if (!date || !customer || !productSku || !qty || !mdp) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const sale = await Sale.findOne({ saleId: req.params.saleId });
    if (!sale) return res.status(404).json({ success: false, message: "Sale not found" });

    const product = await Product.findOne({ sku: productSku });
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    // rollback old qty
    product.quantity += sale.qty;

    // check stock
    if (product.quantity < qty) {
      return res.status(400).json({ success: false, message: "Not enough stock" });
    }

    // deduct new qty
    product.quantity -= qty;
    await product.save();

    // update sale
    sale.date = date;
    sale.customer = customer;
    sale.productSku = productSku;
    sale.qty = qty;
    sale.mdp = mdp;
    sale.totalMdp = qty * mdp;
    await sale.save();

    res.json({ success: true, message: "Sale updated", sale });
  } catch (error) {
    console.error("Update Sale Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * DELETE Sale by saleId
 */
router.delete("/deleteSale/:saleId", async (req, res) => {
  try {
    const sale = await Sale.findOneAndDelete({ saleId: req.params.saleId });
    if (!sale) return res.status(404).json({ success: false, message: "Sale not found" });

    res.json({ success: true, message: "Sale deleted" });
  } catch (error) {
    console.error("Delete Sale Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;

import Sales from "../models/sales.js";

export const createSale = async (req, res) => {
    try {
        console.log(req);
        
        const { date, customer, product, qty, mdp } = req.body;

        const sale = new Sales({
            date,
            customerName: customer,
            productName: product,
            quantity: qty,
            mdp,
        });

        await sale.save();
        res.status(201).json({ message: "Sale created successfully", sale: sale });
    } catch (error) {
        res.status(500).json({ message: "Error creating sale", error: error.message });
    }
};


export const getAllSales = async (req, res) => {
    try {
        const sales = await Sales.find().sort({ createdAt: -1 });
        res.status(200).json(sales);
    } catch (error) {
        res.status(500).json({ message: "Error fetching sales", error: error.message });
    }
};


export const deleteSale = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedSale = await Sales.findByIdAndDelete(id);

        if (!deletedSale) {
            return res.status(404).json({ message: "Sale not found" });
        }

        res.status(200).json({ message: "Sale deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting sale", error: error.message });
    }
};



export const getSaleById = async (req, res) => {
    try {
        const { id } = req.params;
        const sale = await Sales.findById(id);

        if (!sale) {
            return res.status(404).json({ message: "Sale not found" });
        }

        res.status(200).json(sale);
    } catch (error) {
        res.status(500).json({ message: "Error fetching sale", error: error.message });
    }
};

export const updateSale = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, customerName, productName, quantity, mdp } = req.body;

        const updatedSale = await Sale.findByIdAndUpdate(
            id,
            { date, customerName, productName, quantity, mdp },
            { new: true, runValidators: true }
        );

        if (!updatedSale) {
            return res.status(404).json({ message: "Sale not found" });
        }

        res.status(200).json({ message: "Sale updated successfully", sale: updatedSale });
    } catch (error) {
        res.status(500).json({ message: "Error updating sale", error: error.message });
    }
};
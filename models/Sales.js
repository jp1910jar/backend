import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
    },
    customerName: {
        type: String,
        required: true,
        trim: true
    },
    productName: {
        type: String,
        required: true,
        trim: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    mdp: {
        type: Number,   // or String, depending on your meaning of MDP
        required: true
    }
}, { timestamps: true });

export default mongoose.model("Sales", saleSchema);

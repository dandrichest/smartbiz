import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    price: {
        type: Number,
        required: true,
    },
    costPrice: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        default: 0,
    },
    minStock: {
        type: Number,
        default: 10,
    },
    image: {
        type: String,
        default: "",
    }
},
    {
        timestamps: true,
    }
);

export default mongoose.model("Product", productSchema);
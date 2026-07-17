import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                price: {
                    type: Number,
                    required: true,
                    min: 0,
                },
            },
        ],
        paymentMethod: {
            type: String,
            enum: ["cash",
                "credit",
                "debit",
                "transfer",
                "paypal",
                "pos"],
            required: true,
        },
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        dateOfSale: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model("Sale", saleSchema);
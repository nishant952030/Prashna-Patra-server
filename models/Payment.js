import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Assuming a User model exists
            required: true,
        },
        paymentId: {
            type: String,
            required: true,
            unique: true, // Each payment ID should be unique
        },
        orderId: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            default: "INR",
        },
        status: {
            type: String,
            enum: ["pending", "success", "failed"],
            default: "pending",
        },
        paymentMethod: {
            type: String,
            default: "UPI",
        },
        transactionDetails: {
            type: Object, // Can store response from the payment gateway
            default: {},
        },
    },
    { timestamps: true } // Auto-generates createdAt & updatedAt fields
);

export default mongoose.model("Payment", PaymentSchema);

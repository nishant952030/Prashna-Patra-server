import Payment from "../../models/Payment.js";
import User from "../../models/User.js";

const paymentSuccess = async (req, res) => {
    try {
        const { paymentId, orderId, amount, transactionDetails } = req.body;
        const userId = req.userId;

        if (!userId || !paymentId || !orderId || !amount) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({ success: false, message: "Invalid payment amount" });
        }

        // Check if payment already exists
        const existingPayment = await Payment.findOne({ paymentId });
        if (existingPayment) {
            return res.status(409).json({ success: false, message: "Payment already recorded" });
        }

        // Save new payment
        const newPayment = new Payment({
            userId,
            paymentId,
            orderId,
            amount,
            status: "success",
            transactionDetails,
        });
        await newPayment.save();

        // Update user plan
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.planType = "premium";
        user.planExpiry = new Date();
        user.planExpiry.setDate(user.planExpiry.getDate() + 28); // Adding 28 days
        await user.save();

        return res.status(201).json({ success: true, message: "Payment saved successfully" ,user });

    } catch (error) {
        console.error("Payment Processing Error:", error);
        return res.status(500).json({
            success: false,
            message: "Error saving payment",
            error: error.message
        });
    }
};

export default paymentSuccess;

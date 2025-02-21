const Razorpay = require("razorpay");
require("dotenv").config();

const makeOrder = async (req, res) => {
    try {
        const { amount, receipt } = req.body; // Get amount and currency from request

        // Initialize Razorpay instance
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        // Create order in Razorpay
        const options = {
            amount: amount * 100, // Razorpay uses paise (₹1 = 100 paise)
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
            payment_capture: 1, // Auto-capture payment
        };

        const order = await razorpay.orders.create(options);

        // Send order details to frontend
        res.status(200).json({
            success: true,
            order_id: order.id,
            amount: order.amount,
            currency: order.currency,
            key_id: process.env.RAZORPAY_KEY_ID
        });

    } catch (error) {
        console.error("Razorpay Order Creation Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { makeOrder };

const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { makeOrder } = require("../controllers/payment/orders");
const { default: paymentSuccess } = require("../controllers/payment/success");

const router = express.Router();

router.post("/orders", authMiddleware, makeOrder);
router.post("/payment-success", authMiddleware, paymentSuccess)
module.exports = router;
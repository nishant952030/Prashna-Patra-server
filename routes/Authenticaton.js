const express = require("express");
const { sendOTP, verifyOTP } = require("../controllers/user/user");
const googleAuth = require("../controllers/user/googleAuth");
const router = express.Router();

// Route to handle test generation requests
router.post("/sendOtp", sendOTP);
router.post("/verifyOtp", verifyOTP);
router.post("/googleAuth", googleAuth);

module.exports = router;

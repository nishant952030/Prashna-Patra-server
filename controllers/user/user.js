const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const twilio = require("twilio");

dotenv.config();

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);


const generateToken = (user) => {
    return jwt.sign({ id: user._id, phoneNumber: user.phoneNumber, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

// 🔹 Send OTP via Twilio
exports.sendOTP = async (req, res) => {
    const { phoneNumber, name, email, password } = req.body.formData;

    console.log("hello otp",phoneNumber)
    if (!phoneNumber) return res.status(400).json({ error: "Phone number is required" });

    try {
        let user = await User.findOne({ phoneNumber });

        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
        const otpExpires = Date.now() + 10 * 60 * 1000; // Expires in 10 min

        if (!user) {
            
            user = new User({ phoneNumber, otp, otpExpires, name, email, password: await bcrypt.hash(password, 10) });
        } else {
            user.otp = otp;
            user.otpExpires = otpExpires;
        }
         
        await user.save();

        // Send OTP via Twilio
        await twilioClient.messages.create({
            body: `Your OTP is: ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber,
        });

        res.json({ message: "OTP sent successfully!" });
    } catch (error) {
        console.error("OTP Error:", error);
        res.status(500).json({ error: "Failed to send OTP" });
    }
};

// 🔹 Verify OTP & Login/Register
exports.verifyOTP = async (req, res) => {
    const { phoneNumber, otp, name, email, password } = req.body.formData;

    if (!phoneNumber || !otp) return res.status(400).json({ error: "Phone and OTP required" });

    try {
        const user = await User.findOne({ phoneNumber });

        if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ error: "Invalid or expired OTP" });
        }

        user.otp = undefined; // Clear OTP after verification
        user.otpExpires = undefined;
        user.isVerified = true;
        user.lastLogin = new Date();

        if (name && email && password) {
            user.name = name;
            user.email = email;
            user.password = await bcrypt.hash(password, 10);
            user.isProfileComplete = true;
        }

        await user.save();

        const token = generateToken(user);
        res.json({ message: "Login successful!", token, user,success:true });
    } catch (error) {
        console.error("Verification Error:", error);
        res.status(500).json({ error: "Failed to verify OTP" });
    }
};

// 🔹 Protected Route Example
exports.protectedRoute = async (req, res) => {
    res.json({ message: "You have accessed a protected route!", user: req.user });
};

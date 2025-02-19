const admin = require("../../connections/firebase");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");

const googleAuth = async (req, res) => {
    const { idToken } = req.body;

    try {
        // ✅ Verify Google ID Token
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { uid, name, email, picture } = decodedToken;

        // 🔹 Check if user exists in MongoDB
        let user = await User.findOne({ googleId: uid });

        if (!user) {
            // 🆕 Create New User
            user = new User({
                googleId: uid,
                name,
                email,
                profilePicture: picture,
                lastLogin: new Date(),
            });
            await user.save();
        } else {
            // 🔄 Update Last Login
            user.lastLogin = new Date();
            await user.save();
        }

        // 🎫 Generate JWT Token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        // 🍪 Store Token in HTTP-only Cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({ success: true, message: "Login successful", user });

    } catch (error) {
        console.error("Google Authentication Error:", error);
        res.status(401).json({ success: false, error: "Invalid Google Token" });
    }
};

module.exports = googleAuth;

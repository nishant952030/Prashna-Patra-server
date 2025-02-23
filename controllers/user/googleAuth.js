const admin = require("../../connections/firebase");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");

const googleAuth = async (req, res) => {
    const { idToken } = req.body;

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { uid, name, email, picture } = decodedToken;
        let user = await User.findOne({ googleId: uid });
        if (!user) {
            user = new User({
                googleId: uid,
                name,
                email,
                profilePicture: picture,
                lastLogin: new Date(),
            });
            await user.save();
        } else {
            user.lastLogin = new Date();
            await user.save();
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.json({ success: true, message: "Login successful", user });

    } catch (error) {
        console.error("Google Authentication Error:", error);
        res.status(401).json({ success: false, error: "Invalid Google Token" });
    }
};

module.exports = googleAuth;

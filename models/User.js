const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    googleId: { type: String, required: true, unique: true }, // Unique ID from Google
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, default: null }, // Optional, as Google may not provide it
    profilePicture: { type: String, default: "" }, // Google Profile Picture
    role: { type: String, enum: ["student", "teacher", "admin", "superadmin"], default: "student" },

    isProfileComplete: { type: Boolean, default: false }, // Check if user added extra details
    isActive: { type: Boolean, default: true }, // Soft delete
    lastLogin: { type: Date }, // Last login timestamp
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);

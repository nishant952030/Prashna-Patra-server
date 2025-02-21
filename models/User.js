const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    googleId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, default: null },
    profilePicture: { type: String, default: "" },
    role: { type: String, enum: ["student", "teacher", "admin", "superadmin"], default: "student" },

 
    planType: { type: String, enum: ["free", "premium"], default: "free" },  
    planExpiry: { type: Date, default: null }, 
    freeTestsRemaining: { type: Number, default: 5 }, 

 
    isProfileComplete: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);

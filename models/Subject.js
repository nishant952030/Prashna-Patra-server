const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
    createdBy: { type: String, required: true },
    subjectName: { type: String, required: true, unique: true },
    totalTests: { type: Number, default: 0 }, // Total tests in this subject
    attemptedTests: { type: Number, default: 0 }, // Count of attempted tests
    averageScore: { type: Number, default: null }, // Average score of attempted tests
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Subject", subjectSchema);

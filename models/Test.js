const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true }, 
    title: { type: String, required: true },
    description: { type: String },
    numberOfQuestions: { type: Number, required: true },
    attemptedQuestions: { type: Number, default: 0 },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
    format: { type: String, enum: ["MCQ", "True/False", "Short Answer"], default: "MCQ" },
    generatedQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],

    timeLimit: { type: Number, default: 90 }, 
    negativeMarking: { type: Boolean, default: false },
    negativeMarkingValue: { type: Number, default: 0 }, 

    isAttempted: { type: Boolean, default: false },
    score: { type: Number, default: null },
    status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
    attemptedAt: { type: Date, default: null }, 
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Test", testSchema);

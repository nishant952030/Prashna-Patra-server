const mongoose = require("mongoose");
const questionSchema = new mongoose.Schema({
    question: { type: String, required: true }, // Actual question
    options: [{ type: String, required: true }], // Array of answer choices
    correctAnswer: { type: String, required: true },
    userAnswer: { type: String, default: null },// The correct answer
    createdAt: { type: Date, default: Date.now },
    testId: { type: mongoose.Schema.Types.ObjectId, ref: "Test" }
});

module.exports = mongoose.model("Question", questionSchema);

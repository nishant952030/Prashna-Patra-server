const mongoose = require("mongoose");
const attemptSchema = new mongoose.Schema({
    testId: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true }, // Test being attempted
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Who is attempting?
    responses: [
        {
            questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
            selectedAnswer: { type: String, required: true }
        }
    ],
    score: { type: Number, default: 0 }, // Auto-  for MCQs
    completedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Attempt", attemptSchema);

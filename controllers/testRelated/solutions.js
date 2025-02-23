const Questions = require("../../models/Questions");
const mongoose = require("mongoose");

const getSolutions = async (req, res) => {
    const { testId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(testId)) {
        return res.status(400).json({ success: false, message: "Invalid test ID." });
    }

    try {
        const questionsArray = await Questions.find({ testId: testId });

        if (!questionsArray || questionsArray.length === 0) {
            return res.status(404).json({ success: false, message: "No questions found for the given test ID." });
        }

        return res.status(200).json({ success: true, questions: questionsArray });
    } catch (error) {
        console.error("Error fetching solutions:", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

module.exports = getSolutions;

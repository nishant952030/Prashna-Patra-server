const Questions = require("../../models/Questions");
const Test = require("../../models/Test");
const Subject = require("../../models/Subject"); // Import Subject model

const deleteTest = async (req, res) => {
    try {
        const { testId } = req.params;

        // Find the test to get the subjectId before deleting
        const test = await Test.findById(testId);
        if (!test) {
            return res.status(404).json({ success: false, message: "Test not found" });
        }

        const subjectId = test.subjectId; // Get subjectId from test

        // Delete all associated questions first
        await Questions.deleteMany({ testId });

        // Delete the test itself
        await Test.findByIdAndDelete(testId);

        // Reduce the totalTests count in Subject
        await Subject.findByIdAndUpdate(subjectId, { $inc: { totalTests: -1 } });

        res.status(200).json({ success: true, message: "Test and associated questions deleted successfully!" });
    } catch (error) {
        console.error("Error deleting test:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports = deleteTest;

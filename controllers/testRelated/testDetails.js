const Test = require("../../models/Test");
const getTestDetails = async (req, res) => {
    try {
        const { testId } = req.params;
        const test = await Test.findById(testId).populate("generatedQuestions");

        if (!test) {
            return res.status(404).json({ success: false, message: "Test not found. Please try again" });
        }

        res.status(200).json({ test, success: true });
    } catch (error) {
        console.error("Error fetching test:", error);
        res.status(500).json({ message: "Server error" });
    }
};
module.exports = getTestDetails;
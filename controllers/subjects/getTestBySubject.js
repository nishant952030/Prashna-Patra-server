const Test = require("../../models/Test");

const getTests = async (req, res) => {
    try {
        const { subjectId } = req.params;
        const tests = await Test.find({ subjectId: subjectId });
        
        res.status(200).json({ success: true, tests });
    } catch (error) {
        console.error("Error fetching tests:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}
module.exports = getTests;
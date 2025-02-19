const Subject = require("../../models/Subject");

const subjectDetails = async (req, res) => {
    const { subjectId } = req.params;

    try {
        const subject = await Subject.findOne({ _id: subjectId });

        if (!subject) {
            return res.status(404).json({ success: false, message: "Subject not found." });
        }

        return res.status(200).json({ success: true, subject });

    } catch (error) {
        console.error("Error fetching subject details:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching the subject details.",
            errorDetails: error.message || "Unknown error"
        });
    }
};
module.exports=subjectDetails
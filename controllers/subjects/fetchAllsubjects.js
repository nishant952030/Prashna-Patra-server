const Subject = require("../../models/Subject");

// Get all subjects for a user
const getAllSubjects = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is missing. Unauthorized access."
            });
        }

        const allSubjects = await Subject.find({ createdBy: userId });

        return res.status(200).json({
            success: true,
            message: allSubjects.length ? "Successfully fetched all subjects." : "No subjects found for this user.",
            allSubjects
        });

    } catch (error) {
        console.error("Error fetching subjects:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching the subjects.",
            errorDetails: error.message || "Unknown error"
        });
    }
};

// Get details of a specific subject


// Correct Export Format
module.exports =  getAllSubjects ;

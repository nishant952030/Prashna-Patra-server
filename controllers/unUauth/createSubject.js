const Subject = require("../../models/Subject");

const createSubject = async (req, res) => {
    try {
        const subject = "miscellaneous"
        const userId = req.userId;

        // Check if subject already exists for this user
        const existingSubject = await Subject.findOne({subjectName: subject, createdBy: userId });
        if (existingSubject) {
            return res.status(200).json({ message: "exists",success:false,subject:existingSubject });
        }

        const newSubject = new Subject({
            createdBy: userId,
            subjectName:subject,
            tests: [],
            totalTests: 0,
            attemptedTests: 0,
            averageScore: null
        });

        // Save to database
        await newSubject.save();

        return res.status(201).json({
            message: "Subject created successfully!",
            subject: newSubject,
            success:true
        });

    } catch (error) {
        console.error("Error creating subject:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
module.exports = createSubject;

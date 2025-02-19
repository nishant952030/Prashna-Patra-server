 // Import the Test model

const Test = require("../../models/Test");

// Fetch tests by userId
const getTestsByUser = async (req, res) => {
    try {
        const userId = req?.userId
        const { subjectId }=req.params// Get userId from auth or query
       
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const tests = await Test.find({ userId:userId,subjectId: subjectId }); // Find tests for this user
        res.status(200).json({ tests,success:true });
    } catch (error) {
        console.error("Error fetching tests:", error);
        res.status(500).json({ message: "Server error" });
    }
};

 

module.exports =  getTestsByUser ;


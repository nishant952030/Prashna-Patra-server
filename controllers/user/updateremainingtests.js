const User = require("../../models/User");

const updateRemaining = async (req, res) => {
    const userId = req.userId;

    try {
        const user = await User.findOne({ _id: userId });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }

        if (user.freeTestsRemaining <= 0) {
            return res.status(400).json({
                success: false,
                message: "No free tests remaining",
            });
        }

        user.freeTestsRemaining -= 1;
        await user.save(); // Ensure the update is saved before responding

        return res.status(200).json({
            success: true,
            message: `${user.freeTestsRemaining} free tests remaining`,
            user:user
        });
    } catch (error) {
        console.error("Error updating free tests:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

module.exports = updateRemaining;

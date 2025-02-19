const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token; // Read token from cookies
    if (!token) {
        return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId; // Attach user info to request
        console.log("decoded token value",decoded)
        next(); // Move to the next middleware
    } catch (error) {
        return res.status(403).json({ success: false, message: "Invalid or expired token." });
    }
};

module.exports = authMiddleware;

const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const updateRemaining = require("../controllers/user/updateremainingtests");
const router = express.Router();

router.get("/update-user-remaining-tests", authMiddleware, updateRemaining);

module.exports=router
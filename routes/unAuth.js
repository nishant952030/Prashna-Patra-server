const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const createSubject = require("../controllers/unUauth/createSubject");
const createTest = require("../controllers/unUauth/createTest");
const router = express.Router();

router.post("/create-subject", authMiddleware, createSubject);
router.post("/create-test/:subjectId", authMiddleware, createTest);
module.exports = router;
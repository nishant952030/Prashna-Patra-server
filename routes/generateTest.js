const express = require("express");
const runDeepSeek = require("../controllers/generateRespnse");
const createTest = require("../controllers/testRelated/createTest");
const authMiddleware = require("../middleware/authMiddleware");
const  getTestsByUser  = require("../controllers/testRelated/fetchTests");
const getTestDetails = require("../controllers/testRelated/testDetails");
const submitTest = require("../controllers/testRelated/submitTest");
const deleteTest = require("../controllers/testRelated/deleteTest");

const router = express.Router();

// Route to handle test generation requests
router.post("/generate", runDeepSeek);
router.post("/createTest",authMiddleware, createTest);
router.get("/fetchTests/:subjectId", authMiddleware, getTestsByUser);
router.get("/testDetails/:testId", authMiddleware, getTestDetails);
router.post("/submitTest", authMiddleware, submitTest);
router.get("/deleteTest/:testId", authMiddleware, deleteTest);

module.exports = router;

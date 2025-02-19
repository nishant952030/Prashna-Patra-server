const express = require("express");

const createSubject = require("../controllers/subjects/createSubject");

const authMiddleware = require("../middleware/authMiddleware");
const getAllSubjects = require("../controllers/subjects/fetchAllsubjects");
const subjectDetails = require("../controllers/subjects/subjectdetails");

const router = express.Router();

router.post("/create-subject", authMiddleware, createSubject);
router.get("/all-subjects", authMiddleware,getAllSubjects);
router.get("/subjectDetails/:subjectId", authMiddleware,subjectDetails);
module.exports = router;
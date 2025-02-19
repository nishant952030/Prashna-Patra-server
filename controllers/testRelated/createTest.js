const Test = require("../../models/Test");
const Question = require("../../models/Questions");
const Subject = require("../../models/Subject.js");

const createTest = async (req, res) => {
    try {
        const {
            title,
            description,
            questionCount,
            difficulty,
            questionsType,
            subjectId,
            negative,
            timePerQuestion
        } = req.body.formData;

        const { questionsArray } = req.body;
        const userId = req.userId;

        if (!questionsArray || questionsArray.length === 0) {
            return res.status(400).json({ success: false, message: "Questions array cannot be empty" });
        }

        console.log("Creating new test...");
        const newTest = new Test({
            userId,
            title,
            description,
            numberOfQuestions: questionCount,
            difficulty,
            negativeMarking: negative,
            timeLimit: timePerQuestion,
            format: questionsType,
            generatedQuestions: [],
            subjectId
        });

        await newTest.save();  // Save the test first to get its ID
        const testId = newTest._id; // Get the test ID

        console.log("Inserting questions...");
        const insertedQuestions = await Question.insertMany(questionsArray, { ordered: false });

        const questionIds = insertedQuestions.map(q => q._id);

        // **Updating all inserted questions to add the testId**
        await Question.updateMany(
            { _id: { $in: questionIds } },
            { $set: { testId: testId } }
        );

        // **Now update the test document with these questions**
        newTest.generatedQuestions = questionIds;
        await newTest.save(); // Save test with updated questions

        console.log("Updating subject data...");
        const [subject, tests] = await Promise.all([
            Subject.findById(subjectId),
            Test.find({ userId, subjectId, isAttempted: true })
        ]);

        if (subject) {
            subject.attemptedTests = tests.length;
            subject.totalTests += 1;
            await subject.save();
        }

        res.status(201).json({ success: true, message: "Test created successfully!", test: newTest });
    } catch (error) {
        console.error("Error creating test:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports = createTest;

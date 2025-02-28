const Test = require("../../models/Test");
const Question = require("../../models/Questions");
const Subject = require("../../models/Subject.js");
const User=require("../../models/User.js")
const createTest = async (req, res) => {
    try {
        const {
            title,
            description,
            questionCount,
            difficulty,
            questionsType,
            negative,
            timePerQuestion
        } = req.body.testData;

        const { questionsArray } = req.body;
        const userId = req.userId;
        const { subjectId } = req.params;

        if (!questionsArray || questionsArray.length === 0) {
            return res.status(400).json({ success: false, message: "Questions array cannot be empty" });
        }

        let correctCount = 0;
        let incorrectCount = 0;
        let score = 0;

        for (let i = 0; i < questionsArray.length; i++) {
            const question = questionsArray[i];
            if (question.userAnswer && question.correctAnswer) {
                if (question.userAnswer === question.correctAnswer) {
                    correctCount++;
                    score += 1;
                } else {
                    incorrectCount++;
                    if (negative) {
                        score -= 0.25;
                    }
                }
            }
        }

        let answeredCount = 0;

        for (let i = 0; i < questionsArray.length; i++) {
            if (questionsArray[i].userAnswer !== undefined && questionsArray[i].userAnswer !== "") {
                answeredCount++;
            }
        }
        const user = await User.findOne({ _id: userId });
        if (user.freeTestsRemaining === 0 && user.planType==="free" ) return res.status(400).json({
            message: "All attempts exhausted",
            success: false
        })
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
            subjectId,
            isAttempted: true,
            attemptedQuestions: answeredCount,
            score,

        });

        await newTest.save();
        const testId = newTest._id;

        console.log("Inserting questions...");
        const insertedQuestions = await Question.insertMany(questionsArray, { ordered: false });

        const questionIds = insertedQuestions.map(q => q._id);

        await Question.updateMany(
            { _id: { $in: questionIds } },
            { $set: { testId: testId } }
        );

        newTest.generatedQuestions = questionIds;
        await newTest.save();

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
        
        user.freeTestsRemaining -= 0;
        res.status(201).json({
            success: true,
            message: "Test created successfully!",
            test: newTest,
            score: newTest.score
        });
    } catch (error) {
        console.error("Error creating test:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports = createTest;

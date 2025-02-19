const Question = require("../../models/Questions");
const Test = require("../../models/Test");

const submitTest = async (req, res) => {


    const { questions, testId } = req.body;
    const userId = req.userId;


    try {


        const updates = questions.map(async (q) => {
            const question = await Question.findOne({ question: q.question, testId });
            if (question) {
                question.userAnswer = q.userAnswer;
                return question.save();
            }
        });
        await Promise.all(updates);


        const questionsForScore = await Question.find({ testId });
        const test = await Test.findOne({ _id: testId });

        if (!test) {
            return res.status(404).json({ success: false, message: "Test not found" });
        }

        let attemptedQuestions = 0; 
        const score = questionsForScore.reduce((total, q) => {
            if (q.userAnswer === null || q.userAnswer === undefined) {
                return total; 
            }
            attemptedQuestions++;

            if (q.userAnswer === q.correctAnswer) {
                return total + 1; 
            } else {
                return test.negativeMarking ? total - 0.25 : total; 
            }
        }, 0);

      
        test.score = score;
        test.isAttempted = true;
        test.attemptedQuestions = attemptedQuestions; 
        await test.save();

        return res.status(200).json({ success: true, message: "Test submitted successfully!", score });


    } catch (error) {
        console.error("Error submitting test:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports = submitTest;

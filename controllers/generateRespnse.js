const { default: Groq } = require("groq-sdk/index.mjs");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

async function runDeepSeek(req, res) {
    try {
        const { description, questionCount, difficulty, questionType } = req.body.formData;

        if (!description) {
            return res.status(400).json({ error: "Topic description is required" });
        }

        const topic = `Topic: ${description} with ${questionCount} questions, difficulty: ${difficulty}, type: ${questionType}. If mixed, use both MCQs and true/false questions.`;

        const rule = `
Return a **valid JSON** with an array called "questions" containing **exactly ${questionCount}** multiple-choice questions.

1. Ensure the JSON is correctly formatted without extra text.
2. Each question should have:
   - "question": The question text.
   - "options": An array of exactly four answer choices.
   - "correctAnswer": The correct answer (MUST be one of the options).
3. Do not include explanations, extra formatting, or non-JSON text.
4. Respond with **only** the JSON, nothing else.

Generate questions on: **${topic}**.
`;

        const chatCompletion = await groq.chat.completions.create({
            model: "deepseek-r1-distill-llama-70b",
            messages: [{ role: "user", content: rule }],
            temperature: 0.8,
            max_completion_tokens: 4096,
            top_p: 0.95,
        });

        let responseText = chatCompletion.choices[0].message.content;
        console.log("Raw AI Response:", responseText);

       
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.error("Invalid JSON format from AI:", responseText);
            return res.status(500).json({ error: "Invalid JSON format received from AI" });
        }

        let jsonResponse;
        try {
            jsonResponse = JSON.parse(jsonMatch[0]);

            if (jsonResponse.questions.length !== questionCount) {
                console.error(`Expected ${questionCount} questions, but got ${jsonResponse.questions.length}`);
                return res.status(500).json({ error: "Incorrect number of questions generated", success: false });
            }

            function shuffleArray(array, correctAnswer) {
                let shuffled = [...array];
                let correctIndex = shuffled.indexOf(correctAnswer);

                for (let i = shuffled.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                }

                if (!shuffled.includes(correctAnswer)) {
                    shuffled[0] = correctAnswer;
                }

                return shuffled;
            }

            jsonResponse.questions = jsonResponse.questions.map(q => {
                if (!q.options.includes(q.correctAnswer)) {
                    console.warn(`Invalid correct answer detected: ${q.correctAnswer}`);
                    return q;
                }

                q.options = shuffleArray(q.options, q.correctAnswer);
                return q;
            });

        } catch (error) {
            console.error("Failed to parse JSON:", jsonMatch[0]);
            return res.status(500).json({ error: "Failed to parse cleaned JSON", success: false });
        }

        return res.json({ jsonResponse, success: true });

    } catch (error) {
        console.error("Error fetching response:", error);
        res.status(500).json({ error: "Failed to generate response" });
    }
}

module.exports = runDeepSeek;

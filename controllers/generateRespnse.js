const { default: Groq } = require("groq-sdk/index.mjs");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY, // Store your API key in a .env file
});

async function runDeepSeek(req, res) {
    try {
        const { description, questionCount, difficulty, questionType } = req.body.formData;
        console.log("no.of questions",req.body.formData)
        const topic= `topic: ${description} with ${questionCount} questions having difficulty ${difficulty} and should be of type :${questionType}. if the type is mixed then  use both mcqs and the true and  false type questions mixed`
        if (!topic) {
            return res.status(400).json({ error: "Topic is required" });
        }

        // Strict rule to enforce JSON format
        const rule = `
Generate exactly ${questionCount} multiple-choice questions in JSON format following these rules:

1. The response must be a valid JSON object.
2. The JSON must contain an array called "questions" with exactly ${questionCount} questions.
  (point 2 is important, if it is not matched then it breaks the flow of the questions)
3. Each question object should have:
   - "question" (string): The question text.
   - "options" (array): An array of exactly four answer choices.
   - "correctAnswer" (string): The correct answer, which MUST be one of the options.
4. Do NOT include any explanations, metadata, or additional text—just return the JSON.

Now generate multiple-choice questions on the topic: **${topic}**`;


        const chatCompletion = await groq.chat.completions.create({
            model: "deepseek-r1-distill-llama-70b",
            messages: [{ role: "user", content: rule }],
            temperature: 0.8,
            max_completion_tokens: 4096,
            top_p: 0.95,
        });

        let responseText = chatCompletion.choices[0].message.content;
        console.log(responseText)

        // Extract only JSON using regex
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.error("AI did not return valid JSON:", responseText);
            return res.status(500).json({ error: "Invalid JSON format received from AI" });
        }

        let jsonResponse;
        try {
            jsonResponse = JSON.parse(jsonMatch[0]);
            console.log(jsonResponse)

            function shuffleArray(array) {
                // Shuffle an array in place using the Fisher-Yates algorithm
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
                }
            }

            jsonResponse.questions = jsonResponse.questions.map(q => {
                if (!q.options.includes(q.correctAnswer)) {
                    console.warn(`Invalid correct answer detected: ${q.correctAnswer}`);
                    return q; // Skip modifying this question if incorrect
                }

                // Shuffle options while keeping the correct answer inside
                shuffleArray(q.options);

                return q;
            });


        } catch (error) {
            console.error("Invalid JSON response after cleaning:", jsonMatch[0]);
            return res.status(500).json({ error: "Failed to parse cleaned JSON" });
        }

        return res.json({jsonResponse, success:true});

    } catch (error) {
        console.error("Error fetching response:", error);
        res.status(500).json({ error: "Failed to generate response" });
    }
}

module.exports = runDeepSeek;

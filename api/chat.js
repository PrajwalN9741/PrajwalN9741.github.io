// api/chat.js
import OpenAI from "openai";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ALLOWED_ORIGIN = "https://prajwaln9741.github.io";

if (!OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is missing");
}

/**
 * Create OpenAI client ONCE (best practice)
 */
const client = new OpenAI({
  apiKey: OPENAI_API_KEY,
  timeout: 20000
});

/**
 * Portfolio system prompt
 */
const SYSTEM_PROMPT = `
You are Prajwal N's portfolio AI assistant.

ONLY answer questions related to:
- Prajwal N
- His education, skills, projects
- Programming and technologies he knows

Education:
- Degree: National Degree College, Bagepalli (CGPA 8.34, 2026)
- PU: Shree Vijaya College, Chintamani (82%)
- School: Kishor Composite High School, Chelur (89.6%)

Skills:
HTML, CSS, JavaScript, Bootstrap
Python, Java, C, C++
NumPy, Pandas, Tkinter
DBMS, SQLite

Projects:
- College Website
- Python-based applications

If the question is unrelated, reply:
"I'm designed to answer only about Prajwal N and his portfolio."
`;

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method Not Allowed" });
  }

  const message = req.body?.message;
  if (!message) {
    return res.status(400).json({ reply: "Message is required" });
  }

  try {
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message }
      ]
    });

    return res.status(200).json({
      reply: response.output_text || "No response generated"
    });

  } catch (err) {
    console.error("OpenAI failure:", err);
    return res.status(500).json({
      reply: "⚠️ AI is temporarily unavailable"
    });
  }
}

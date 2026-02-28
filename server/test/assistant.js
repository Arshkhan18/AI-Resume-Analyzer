/************************************************************
 * assistant.js
 * Smart Router + Memory + CLI
 ************************************************************/

import readline from "readline";
import {
  loadResume,
  initVectorStore,
  getAnswerModel,
  getMemoryModel,
} from "./ragCore.js";

/* ================================
   Global Memory
================================ */

let history = [];
let conversationSummary = "";

/* ================================
   🧠 SMART ROUTER
   Decide whether Pinecone is needed
================================ */

function isResumeQuestion(question) {

  const resumeKeywords = [
    "resume",
    "cv",
    "experience",
    "internship",
    "skills",
    "projects",
    "education",
    "my",
    "i worked",
    "i built",
    "my background"
  ];

  const lower = question.toLowerCase();

  return resumeKeywords.some(keyword => lower.includes(keyword));
}

/* ================================
   Memory Update
================================ */

async function updateMemory(memoryModel) {

  const formatted = history
    .map(h => `${h.role}: ${h.content}`)
    .join("\n");

  const prompt = `
Update the conversation summary concisely.

Previous Summary:
${conversationSummary}

New Conversation:
${formatted}

Return only updated summary.
`;

  const response = await memoryModel.invoke(prompt);

  conversationSummary = response.content;

  history.length = 0; // clear after summarizing
}

/* ================================
   Generate Answer
================================ */

async function generateAnswer(question, retriever, answerModel) {

  let context = "";
  let mode = "GENERAL";

  if (isResumeQuestion(question)) {
    mode = "RESUME";

    try {
      const docs = await retriever.invoke(question);
      context = docs.map(d => d.pageContent).join("\n");
    } catch (err) {
      console.log("⚠️ Pinecone unavailable. Continuing without context.");
    }
  }

  const prompt = `
You are an intelligent AI career assistant.

Mode: ${mode}

Conversation Summary:
${conversationSummary}

Resume Context:
${context || "Not required for this question"}

User Question:
${question}

Rules:
- If Mode = RESUME → answer strictly using resume context.
- If Mode = GENERAL → explain clearly in simple terms.
- Be structured and concise.
`;

  const response = await answerModel.invoke(prompt);

  return response.content;
}

/* ================================
   Start CLI
================================ */

async function start() {

  const docs = await loadResume("./Arsh_cv_R1.pdf");
  const vectorStore = await initVectorStore("test-user", docs);
  const retriever = vectorStore.asRetriever({ k: 3 });

  const answerModel = getAnswerModel();
  const memoryModel = getMemoryModel();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("\n🎓 Smart Resume Assistant Ready!");
  console.log("Type 'exit' to quit.\n");

  async function chat() {
    rl.question("You: ", async (question) => {

      if (question.toLowerCase() === "exit") {
        process.exit(0);
      }

      try {

        history.push({ role: "User", content: question });

        const answer = await generateAnswer(
          question,
          retriever,
          answerModel
        );

        console.log("\nAssistant:\n", answer, "\n");

        history.push({ role: "Assistant", content: answer });

        if (history.length >= 6) {
          await updateMemory(memoryModel);
        }

      } catch (err) {
        console.error("❌ Error:", err.message);
      }

      chat();
    });
  }

  chat();
}

start();
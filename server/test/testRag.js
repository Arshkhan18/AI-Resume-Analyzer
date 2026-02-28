/************************************************************
 *  Conversational Resume RAG (Gemini + Pinecone)
 *  Two-Model Architecture with Memory
 *  Running inside /test
 ************************************************************/

import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import fs from "fs";
import readline from "readline";
import pdf from "pdf-parse-new";

import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

/* =========================
   1️⃣ Load Resume
========================= */


const pdfBuffer = fs.readFileSync("./Arsh_cv_R1.pdf");
const pdfData = await pdf(pdfBuffer);
const resumeText = pdfData.text;

/* =========================
   2️⃣ Split Resume
========================= */

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 100,
});

const docs = await splitter.createDocuments([resumeText]);

/* =========================
   3️⃣ Gemini Embeddings (Slice 3072 → 768)
========================= */

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-embedding-001",
});

// Override embedding functions to slice
const originalEmbedQuery = embeddings.embedQuery.bind(embeddings);
const originalEmbedDocuments = embeddings.embedDocuments.bind(embeddings);

embeddings.embedQuery = async (text) => {
  const vector = await originalEmbedQuery(text);
  return vector.slice(0, 768);
};

embeddings.embedDocuments = async (texts) => {
  const vectors = await originalEmbedDocuments(texts);
  return vectors.map(v => v.slice(0, 768));
};

const testVector = await embeddings.embedQuery("hello world");
console.log("Sliced embedding dimension:", testVector.length);

/* =========================
   4️⃣ Pinecone Setup
========================= */

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});
console.log("Pinecone connection successful.");
const indexes=await pinecone.listIndexes();
console.log("Pinecone indexes:", indexes);
const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);

const vectorStore = await PineconeStore.fromExistingIndex(
  embeddings,
  {
    pineconeIndex: index,
    namespace: "test-user",
  }
);

// Upload if namespace empty
let stats;
try {
  stats = await index.describeIndexStats();
} catch (err) {
  console.error("⚠️ Pinecone connection failed.");
  process.exit(1);
}

if (!stats.namespaces?.["test-user"]) {
  console.log("📦 Uploading resume...");
  await PineconeStore.fromDocuments(docs, embeddings, {
    pineconeIndex: index,
    namespace: "test-user",
  });
  console.log("✅ Upload complete.");
}

const retriever = vectorStore.asRetriever({ k: 5 });

/* =========================
   5️⃣ Two Models
========================= */

const memoryModel = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-2.5-flash",
  temperature: 0,
});

const answerModel = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-2.5-flash",
  temperature: 0.2,
});

let conversationSummary = "";

/* =========================
   6️⃣ CLI Chat Loop
========================= */

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("\n🎓 Conversational Gemini Resume Assistant Ready!");
console.log("Type 'exit' to quit.\n");

async function askQuestion() {
  rl.question("You: ", async (question) => {

    if (question.toLowerCase() === "exit") {
      rl.close();
      process.exit(0);
    }
   
    try {

      // 🔎 Retrieve Resume Context
      let relevantDocs;

try {
  relevantDocs = await retriever.invoke(question);
} catch (err) {
  console.error("⚠️ Pinecone temporarily unreachable. Retrying...");
  
  await new Promise(res => setTimeout(res, 10000));

  relevantDocs = await retriever.invoke(question);
}
      const resumeContext = relevantDocs
        .map(doc => doc.pageContent)
        .join("\n");

      // 🧠 Generate Final Answer
      const answerPrompt = `
You are an intelligent AI career assistant.

Conversation Summary:
${conversationSummary}

Resume Context:
${resumeContext}

User Question:
${question}

Rules:
- If question is about resume → answer strictly from resume.
- If question is about a study topic → explain clearly and relate to resume if possible.
- If unrelated to both → answer generally but mention it’s outside resume.
- Be structured and concise.
`;

      const answerResponse = await answerModel.invoke(answerPrompt);
      const answer = answerResponse.content;

      console.log("\nAssistant:\n", answer, "\n");

      // 📝 Update Conversation Summary
      const summaryPrompt = `
Update the conversation summary concisely.

Previous summary:
${conversationSummary}

New exchange:
User: ${question}
Assistant: ${answer}

Return only updated summary.
`;

      const summaryResponse = await memoryModel.invoke(summaryPrompt);
      conversationSummary = summaryResponse.content;

    } catch (err) {
      console.error("❌ Error:", err.message);
    }

    askQuestion();
  });
}

askQuestion();
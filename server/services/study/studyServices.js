import StudyResume from "../../models/StudyResume.js";
import StudyMemory from "../../models/StudyMemory.js";
import {
  extractAndSplit,
  initUserVectorStore,
  getStudyModel,
  getMemoryModel
} from "./ragCore.js";

/* =====================================
   Upload Resume (unchanged)
===================================== */

export async function uploadStudyResume(userId, filePath, fileName) {

  const docs = await extractAndSplit(filePath);

  await initUserVectorStore(userId, docs);

  await StudyResume.deleteMany({ userId });
  await StudyMemory.deleteMany({ userId }); // 🔥 reset memory on new resume

  const resume = new StudyResume({
    userId,
    fileName,
    extractedText: docs.map(d => d.pageContent).join("\n")
  });

  await resume.save();

  return {
    message: "Study resume uploaded and replaced successfully"
  };
}

/* =====================================
   Update Memory (Auto Summarization)
===================================== */

async function updateMemory(userId) {

  const memoryDoc = await StudyMemory.findOne({ userId });
  if (!memoryDoc) return;

  const memoryModel = getMemoryModel();

  const formatted = memoryDoc.messages
    .map(m => `${m.role}: ${m.content}`)
    .join("\n");

  const prompt = `
Update the conversation summary concisely.

Previous Summary:
${memoryDoc.summary}

New Conversation:
${formatted}

Return only updated summary.
`;

  const response = await memoryModel.invoke(prompt);

  memoryDoc.summary = response.content;
  memoryDoc.messages = []; // clear short-term memory
  await memoryDoc.save();
}

/* =====================================
   Study Chat (RAG + Memory)
===================================== */

export async function studyChat(userId, question) {
  const resume = await StudyResume.findOne({ userId });
 if (!resume) {
  return "Please upload your study resume first.";
}

  let memoryDoc = await StudyMemory.findOne({ userId });

  if (!memoryDoc) {
    memoryDoc = await StudyMemory.create({
      userId,
      summary: "",
      messages: []
    });
  }

  const vectorStore = await initUserVectorStore(userId);
  const retriever = vectorStore.asRetriever({ k: 2 });

  let docs;
  const maxRetries = 2;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      docs = await retriever.invoke(question);
      break;
    } catch (err) {
      console.error(`Pinecone query attempt ${attempt + 1} failed:`, err.message);
      if (attempt === maxRetries) {
        return "Unable to reach the knowledge base right now. Please check your internet connection and try again.";
      }
      // Wait before retrying (1s, then 2s)
      await new Promise(r => setTimeout(r, (attempt + 1) * 1000));
    }
  }

  if (!docs || docs.length === 0) {
    return "This topic is not mentioned in your resume.";
  }

  const context = docs.map(d => d.pageContent).join("\n");

  if (!context.trim()) {
    return "This topic is not mentioned in your resume.";
  }

  const model = getStudyModel();

  const prompt = `
You are a professional placement preparation assistant.

Rules:
1. Answer STRICTLY using resume context.
2. Be concise and structured.
3. Adapt explanation style if requested.

Conversation Summary:
${memoryDoc.summary}

Recent Messages:
${memoryDoc.messages.map(m => `${m.role}: ${m.content}`).join("\n")}

Resume Context:
${context}

User Question:
${question}
`;

  const response = await model.invoke(prompt);
  const answer = response.content;

  // Store conversation
  memoryDoc.messages.push({ role: "User", content: question });
  memoryDoc.messages.push({ role: "Assistant", content: answer });

  // Auto summarize after 6 messages
  if (memoryDoc.messages.length >= 6) {
    await updateMemory(userId);
  } else {
    await memoryDoc.save();
  }

  return answer;
}
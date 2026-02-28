import fs from "fs";
import pdf from "pdf-parse-new";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

/* =====================================
   1️⃣ Extract & Chunk Resume
===================================== */

export async function extractAndSplit(filePath) {
  const buffer = fs.readFileSync(filePath);
  const pdfData = await pdf(buffer);

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
  });

  return await splitter.createDocuments([pdfData.text]);
}

/* =====================================
   2️⃣ Embeddings
===================================== */

function getEmbeddings() {
  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "gemini-embedding-001",
  });

  // Slice 3072 → 768 to match Pinecone index dimension
  const originalQuery = embeddings.embedQuery.bind(embeddings);
  const originalDocs = embeddings.embedDocuments.bind(embeddings);

  embeddings.embedQuery = async (text) => {
    const vector = await originalQuery(text);
    return vector.slice(0, 768);
  };

  embeddings.embedDocuments = async (texts) => {
    const vectors = await originalDocs(texts);
    return vectors.map(v => v.slice(0, 768));
  };

  return embeddings;
}

/* =====================================
   3️⃣ Init Pinecone (Per User Namespace)
   🔥 Automatically clears old resume
===================================== */

export async function initUserVectorStore(userId, docs = null) {

  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });

  const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);
  const embeddings = getEmbeddings();

  const namespace = `study_${userId}`;

  if (docs) {
    try {
      await index.namespace(namespace).deleteAll();
      console.log("Old study vectors cleared.");
    } catch (err) {
      console.log("No previous namespace found.");
    }
    if (!docs.length) {
  return "This topic is not mentioned in your resume.";
}

    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: index,
      namespace,
    });
  }

  return PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex: index,
    namespace,
  });
}

/* =====================================
   4️⃣ Study Model
===================================== */

export function getStudyModel() {
  return new ChatGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "gemini-2.5-flash",
    temperature: 0.2,
  });
}

export function getMemoryModel() {
  return new ChatGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "gemini-2.5-flash",
    temperature: 0,
  });
}
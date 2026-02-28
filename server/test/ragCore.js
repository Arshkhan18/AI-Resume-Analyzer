/************************************************************
 * ragCore.js
 * Config + Embeddings + Pinecone + Models
 ************************************************************/

import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import fs from "fs";
import pdf from "pdf-parse-new";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

/* ================================
   1️⃣ Load + Split Resume
================================ */

export async function loadResume(path) {
  const pdfBuffer = fs.readFileSync(path);
  const pdfData = await pdf(pdfBuffer);

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
  });

  return await splitter.createDocuments([pdfData.text]);
}

/* ================================
   2️⃣ Embeddings (3072 → 768)
================================ */

function getEmbeddings() {
  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "gemini-embedding-001",
  });

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

/* ================================
   3️⃣ Pinecone Init
================================ */

export async function initVectorStore(namespace, docs = null) {

  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });

  const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);
  const embeddings = getEmbeddings();

  if (docs) {
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

/* ================================
   4️⃣ Models
================================ */

export function getAnswerModel() {
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
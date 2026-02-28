import { initChatModel } from "langchain";
import dotenv from "dotenv";
dotenv.config();
const model= await initChatModel(
    "google-genai:gemini-3-flash-preview",
    {
        apiKey: process.env.GOOGLE_API_KEY,
        temperature: 0.2
    }
);

export default model;

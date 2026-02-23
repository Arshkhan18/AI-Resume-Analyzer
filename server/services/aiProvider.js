import { initChatModel } from "langchain";
import dotenv from "dotenv";
dotenv.config();
const model= await initChatModel(
    "google-genai:gemini-2.5-flash-lite",
    {
        apiKey: process.env.GOOGLE_API_KEY,
        temperature: 0
    }
);

export default model;

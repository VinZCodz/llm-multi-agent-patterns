import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export const model = new ChatGoogleGenerativeAI({
    model: process.env.MODEL,
    maxRetries: 2,
});
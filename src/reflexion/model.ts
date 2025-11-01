import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export const Model = new ChatGoogleGenerativeAI({
    model: process.env.MODEL!,
    maxRetries: 2,
});
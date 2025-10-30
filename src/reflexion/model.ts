import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export const ResponderModel = new ChatGoogleGenerativeAI({
    model: process.env.RESPONDER_MODEL!,
    maxRetries: 2,
});
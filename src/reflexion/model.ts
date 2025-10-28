import { ChatGroq } from "@langchain/groq";

export const ResponderModel=new ChatGroq({
    model: process.env.RESPONDER_MODEL!,
});

export const RevisorModel=new ChatGroq({
    model: process.env.REVISOR_MODEL!,
});
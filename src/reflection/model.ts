import { ChatGroq } from "@langchain/groq";

export const SupervisorModel=new ChatGroq({
    model: process.env.SUPERVISOR_MODEL!,
});
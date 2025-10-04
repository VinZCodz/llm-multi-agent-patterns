import { ChatGroq } from "@langchain/groq";

export const GenerationModel=new ChatGroq({
    model: process.env.WRITER_MODEL!,
});

export const ReflectionModel=new ChatGroq({
    model: process.env.ANALYZER_MODEL!,
});
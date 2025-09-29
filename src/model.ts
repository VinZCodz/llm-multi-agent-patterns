import { ChatGroq } from "@langchain/groq";
import * as tools from "./tools.ts"

export const SupervisorModel=new ChatGroq({
    model: process.env.SUPERVISOR_MODEL!,
});

export const AnalyzerModel=new ChatGroq({
    model: process.env.ANALYZER_MODEL!,
});

export const ResearcherModel=new ChatGroq({
    model: process.env.RESEARCHER_MODEL!,
}).bindTools([tools.Search]);

export const WriterModel=new ChatGroq({
    model: process.env.WRITER_MODEL!,
});

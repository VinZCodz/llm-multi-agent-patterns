import { MemorySaver, StateGraph } from "@langchain/langgraph"
import { SupervisorState } from "./state.ts"
import *  as model from "./model.ts"
import fs from "fs/promises";
import { PromptTemplate } from "@langchain/core/prompts";

let graphStarted = false;

const Supervisor = async (state: typeof SupervisorState.State) => {
    const promptFromTemplate = PromptTemplate.fromTemplate((await fs.readFile("./src/prompts/Supervisor.txt", "utf-8")));
    const formattedPrompt = await promptFromTemplate.format({
        isResearchDone: state.researchData?.length !== 0,
        isAnalysesDone: state.keyFeatures?.length !== 0,
        isFinalReportDone: state.finalReport?.length !== 0
    });

    const response = await model.SupervisorModel.invoke(
        [formattedPrompt],
        { response_format: { type: 'json_object' } }
    );
    const responseJson = JSON.parse(response.content as string);

    if (!graphStarted) {
        graphStarted = true;

        return {
            query: state.messages.at(-1)?.content,
            nextAgent: responseJson.nextAgent
        }
    }

    return {
        nextAgent: responseJson.nextAgent
    }
}

const Researcher = async (state: typeof SupervisorState.State) => {
    const promptFromTemplate = PromptTemplate.fromTemplate((await fs.readFile("./src/prompts/Researcher.txt", "utf-8")));
    const formattedPrompt = await promptFromTemplate.format({ query: state.query });

    const response = await model.ResearcherModel.invoke(
        [formattedPrompt],
        { response_format: { type: 'json_object' } }
    );
    const responseJson = JSON.parse(response.content as string);

    return {
        researchData: responseJson.researchData,
        nextAgent: 'Supervisor'
    }
}

const Analyzer = async (state: typeof SupervisorState.State) => {
    const promptFromTemplate = PromptTemplate.fromTemplate((await fs.readFile("./src/prompts/Analyzer.txt", "utf-8")));
    const formattedPrompt = await promptFromTemplate.format({ researchData: state.researchData });

    const response = await model.AnalyzerModel.invoke(
        [formattedPrompt],
        { response_format: { type: 'json_object' } }
    );
    const responseJson = JSON.parse(response.content as string);

    return {
        keyFeatures: responseJson.keyFeatures,
        nextAgent: 'Supervisor'
    }
}

const Writer = async (state: typeof SupervisorState.State) => {
    const promptFromTemplate = PromptTemplate.fromTemplate((await fs.readFile("./src/prompts/Writer.txt", "utf-8")));

    const formattedPrompt = await promptFromTemplate.format({
        query: state.query,
        researchData: state.researchData,
        keyFeatures: state.keyFeatures.join('\n'),
    });

    const response = await model.AnalyzerModel.invoke(
        [formattedPrompt],
        { response_format: { type: 'json_object' } }
    );

    const responseJson = JSON.parse(response.content as string);
    return {
        finalReport: responseJson.finalReport,
        nextAgent: 'Supervisor'
    }
}

const NextAgent = (state: typeof SupervisorState.State) => {
    return state.nextAgent;
}

const graph = new StateGraph(SupervisorState)
    .addNode("Supervisor", Supervisor)
    .addNode("Researcher", Researcher)
    .addNode("Analyzer", Analyzer)
    .addNode("Writer", Writer)
    .addEdge("__start__", "Supervisor")
    .addConditionalEdges("Supervisor", NextAgent)
    .addConditionalEdges("Researcher", NextAgent)
    .addConditionalEdges("Analyzer", NextAgent)
    .addConditionalEdges("Writer", NextAgent);

export const SupervisorAgent = graph.compile();
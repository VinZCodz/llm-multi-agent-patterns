import { StateGraph } from "@langchain/langgraph"
import { SupervisorState } from "./state.ts"
import *  as model from "./model.ts"
import fs from "fs/promises";
import { PromptTemplate } from "@langchain/core/prompts";
import * as tools from "./tools.ts"
import { ToolNode } from "@langchain/langgraph/prebuilt";

const Supervisor = async (state: typeof SupervisorState.State) => {
    console.log(`\n\n------------Supervisor: Assigning Task to Next Agent--------------\n\n`);

    const promptFromTemplate = PromptTemplate.fromTemplate((await fs.readFile("./src/prompts/Supervisor.txt", "utf-8")));
    const formattedPrompt = await promptFromTemplate.format({
        isResearchDone: !!state.researchData,
        isAnalysesDone: !!state.keyFeatures,
        isFinalReportDone: !!state.finalReport
    });

    const response = await model.SupervisorModel.invoke(
        [formattedPrompt],
        { response_format: { type: 'json_object' } }
    );
    const responseJson = JSON.parse(response.content as string);

    if (!state.query) {
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
    console.log(`------------Researcher: Researching on User Query!--------------`);

    const promptFromTemplate = PromptTemplate.fromTemplate((await fs.readFile("./src/prompts/Researcher.txt", "utf-8")));
    const formattedPrompt = await promptFromTemplate.format({ query: state.query });

    const response = await model.ResearcherModel.invoke([formattedPrompt, ...state.messages]);

    if (!!response.tool_calls?.length) {
        if(state.messages.length>3){
            return {
                messages: { role: "user", content: "Stop Research! proceed to generation"},
                nextAgent: 'Researcher'
            }
        }
        return {
            messages: response,
            nextAgent: 'tools'
        }
    }

    return {
        researchData: response.content,
        nextAgent: 'Supervisor'
    }
}

const Analyzer = async (state: typeof SupervisorState.State) => {
    console.log(`------------Analyzer: Analyzing key features!--------------`);

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
    console.log(`------------Writer: Writing Final Report--------------\n\n`);

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

const toolNode = new ToolNode([tools.Search]);

const NextAgent = (state: typeof SupervisorState.State) => {
    return state.nextAgent;
}

const graph = new StateGraph(SupervisorState)
    .addNode("Supervisor", Supervisor)
    .addNode("Researcher", Researcher)
    .addNode("Analyzer", Analyzer)
    .addNode("Writer", Writer)
    .addNode("tools", toolNode)
    .addEdge("__start__", "Supervisor")
    .addConditionalEdges("Supervisor", NextAgent)
    .addConditionalEdges("Researcher", NextAgent)
    .addEdge("tools", "Researcher")
    .addConditionalEdges("Analyzer", NextAgent)
    .addConditionalEdges("Writer", NextAgent);

export const SupervisorAgent = graph.compile();
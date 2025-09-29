import { MemorySaver, StateGraph } from "@langchain/langgraph"
import { SupervisorState } from "./state.ts"
import *  as model from "./model.ts"
import fs from "fs/promises";
import { PromptTemplate } from "@langchain/core/prompts";

const Supervisor = async (state: typeof SupervisorState.State) => {
    const promptFromTemplate = PromptTemplate.fromTemplate((await fs.readFile("./src/prompts/Supervisor.txt", "utf-8")));

    const formattedPrompt = await promptFromTemplate.format({
      isResearchDone: state.researchData?,
      isAnalysesDone: state.keyFeatures.Any(),
      isFinalReportDone: state.finalReport?
    });

    const response=model.SupervisorModel.invoke(
        [formattedPrompt],
        { response_format: { type: 'json_object' } }
    );

    const responseJson = JSON.parse(response.content as string);

    return {
        nextAgent: responseJson.nextAgent
    }
}

const Researcher = async (state: typeof SupervisorState.State) => {
    const promptFromTemplate = PromptTemplate.fromTemplate((await fs.readFile("./src/prompts/Researcher.txt", "utf-8")));

    const formattedPrompt = await promptFromTemplate.format({query: ,});

    const response=model.ResearcherModel.invoke(
        [formattedPrompt],
        { response_format: { type: 'json_object' } }
    );

    const responseJson = JSON.parse(response.content as string);

    return {
        researchData: responseJson.researchData
    }
}

const Analyzer = async (state: typeof SupervisorState.State) => {
     const promptFromTemplate = PromptTemplate.fromTemplate((await fs.readFile("./src/prompts/Analyzer.txt", "utf-8")));

    const formattedPrompt = await promptFromTemplate.format({researchData: state.researchData});

    const response=model.AnalyzerModel.invoke(
        [formattedPrompt],
        { response_format: { type: 'json_object' } }
    );

    const responseJson = JSON.parse(response.content as string);

    return {
        keyFeatures: responseJson.keyFeatures
    }
}

const Writer = async (state: typeof SupervisorState.State) => {
    const promptFromTemplate = PromptTemplate.fromTemplate((await fs.readFile("./src/prompts/Writer.txt", "utf-8")));

    const formattedPrompt = await promptFromTemplate.format({
        query: ,
        researchData: state.researchData,
        keyFeatures: state.keyFeatures.join(),
    });

    const response=model.AnalyzerModel.invoke(
        [formattedPrompt],
        { response_format: { type: 'json_object' } }
    );

    const responseJson = JSON.parse(response.content as string);

    return {
        finalReport: responseJson.finalReport
    }
}

const NextAgent = (state: typeof SupervisorState.State) => {
    return state.nextAgent;
}

const graph = new StateGraph(SupervisorState)
    .addNode("Supervisor", Supervisor)
    .addNode("Researcher", Researcher)
    .addNode("Analyzer", Analyzer)
    .addNode("Writer", Writer);

graph.addEdge("__start__", "Supervisor");

['Supervisor', 'Researcher', 'Analyzer', 'Writer'].forEach((node: string) => {
  graph.addConditionalEdges(node, "NextAgent");
});

//MemorySaver?
const SupervisorAgent = graph.compile({ checkpointer: new MemorySaver() });
import { StateGraph } from "@langchain/langgraph"
import { ReflectionState } from "./state.ts"
import * as model from "./model.ts"
import { PromptTemplate } from "@langchain/core/prompts";
import fs from "fs/promises";

const MAX_REFLECTION_COUNT = 3;

const Writer = async (state: typeof ReflectionState.State) => {
    console.log(`\n\n------------Writer: Generating--------------`);

    state.query = state.query ?? state.messages.at(0)?.content;

    const promptFromTemplate = PromptTemplate.fromTemplate((await fs.readFile("./src/reflection/prompts/writer.txt", "utf-8")));
    const formattedPrompt = await promptFromTemplate.format({
        query: state.query,
        generation: state.generation,
        reflection: state.reflection
    });

    const response = await model.GenerationModel.invoke([formattedPrompt]);

    return {
        query: state.query,
        generation: response.content,
        reflectionCount: state.reflectionCount ?? 0
    }
}

const isReflectionNeeded = async (state: typeof ReflectionState.State) => {
    if (state.reflectionCount < MAX_REFLECTION_COUNT) {
        return "Critique";
    }
    else {
        return "__end__"
    }
}

const Critique = async (state: typeof ReflectionState.State) => {
    console.log(`\n\n------------Critique: Reflecting--------------`);

    const promptFromTemplate = PromptTemplate.fromTemplate((await fs.readFile("./src/reflection/prompts/critique.txt", "utf-8")));
    const formattedPrompt = await promptFromTemplate.format({
        query: state.query,
        generation: state.generation
    });

    const response = await model.ReflectionModel.invoke([formattedPrompt]);

    return {
        reflection: response.content,
        reflectionCount: ++state.reflectionCount
    }
}

const graph = new StateGraph(ReflectionState)
    .addNode("Writer", Writer)
    .addNode("Critique", Critique)
    .addEdge("__start__", "Writer")
    .addConditionalEdges("Writer", isReflectionNeeded)
    .addEdge("Critique", "Writer");


export const ReflectionAgent = graph.compile();
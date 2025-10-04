import { MemorySaver, StateGraph } from "@langchain/langgraph"
import { ReflectionState } from "./state.ts"
import * as model from "./model.ts"

const Writer = async (state: typeof ReflectionState.State) => {
    console.log(`\n\n------------Writer: Genrating--------------\n\n`);

    if(!state.query)
        query: state.messages.at(-1)?.content, 

    const promptFromTemplate = PromptTemplate.fromTemplate((await fs.readFile("./src/reflection/prompts/writer.txt", "utf-8")));
    const formattedPrompt = await promptFromTemplate.format({
        query: state.query,
        generation: state.generation,
        reflection: state.reflection
    });

    const response = await model.GenerationModel.invoke([formattedPrompt]);

    return {
        generation: response.content
    }
}

const isReflectionNeeded = async (state: typeof ReflectionState.State) => {
    if (state.reflectionCount<process.env.MAX_REFLECTION_COUNT) {
        state.reflectionCount++;
        return "Critique";
    }
    else {
        return "__end__"
    }
}

const Critique = async (state: typeof ReflectionState.State) => {
    console.log(`\n\n------------Critique: Reflecting--------------\n\n`);

    const promptFromTemplate = PromptTemplate.fromTemplate((await fs.readFile("./src/reflection/prompts/critique.txt", "utf-8")));
    const formattedPrompt = await promptFromTemplate.format({
        query: state.query,
        generation: state.generation
    });

    const response = await model.ReflectionModel.invoke([formattedPrompt]);

    return {
        reflection: response.content
    }
}

const graph = new StateGraph(ReflectionState)
    .addNode("Writer", Writer)
    .addNode("Critique", Critique)
    .addEdge("__start__", "Writer")
    .addConditionalEdges("Writer", isReflectionNeeded)
    .addEdge("Critique", Writer)


export const ReflectionAgent = graph.compile();
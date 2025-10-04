import { MemorySaver, StateGraph } from "@langchain/langgraph"
import { ReflectionState } from "./state.ts"
import * as model from "./model.ts"

const Writer = async (state: typeof ReflectionState.State) => {
    const response = await model.GenerationModel.invoke("");

    return {
        generation: response.content
    }
}

const Critique = async (state: typeof ReflectionState.State) => {

    return {

    }
}

const isReflectionDone = async (state: typeof ReflectionState.State) => {

    if (true) {
        return "Critique";
    }
    else {
        return "__end__"
    }
}


const graph = new StateGraph(ReflectionState)
    .addNode("Writer", Writer)
    .addNode("Critique", Critique)
    .addEdge("__start__", "Writer")


export const ReflectionAgent = graph.compile({checkpointer: new MemorySaver()});
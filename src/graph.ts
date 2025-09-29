import { MemorySaver, StateGraph } from "@langchain/langgraph"
import { SupervisorState } from "./state.ts"

const Supervisor = async (state: typeof SupervisorState.State) => {

}

const Analyzer = async (state: typeof SupervisorState.State) => {

}

const Researcher = async (state: typeof SupervisorState.State) => {

}

const Writer = async (state: typeof SupervisorState.State) => {

}

const graph = new StateGraph(SupervisorState)
    .addNode("Supervisor", Supervisor)
    .addNode("Analyzer", Analyzer)
    .addNode("Researcher", Researcher)
    .addNode("Writer", Writer);

graph.addEdge("__start__", "Supervisor");


const SupervisorAgent = graph.compile({ checkpointer: new MemorySaver() });
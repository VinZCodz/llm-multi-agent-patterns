import { StateGraph } from "@langchain/langgraph"
import { HierarchicalState } from "./state.ts"

const graph = new StateGraph(HierarchicalState)


export const HierarchicalAgent = graph.compile();
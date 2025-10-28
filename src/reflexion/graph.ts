import { StateGraph } from "@langchain/langgraph"
import { ReflexionState } from "./state.ts"
import * as model from "./model.ts"
import { PromptTemplate } from "@langchain/core/prompts";
import * as tools from "./tools.ts"
import { ToolNode } from "@langchain/langgraph/prebuilt";

const MAX_REFLECTION_COUNT = 3;

const Responder = async (state: typeof ReflexionState.State) => {
    console.log(`\n\n------------Responder--------------`);

    //state.query = state.query ?? state.messages.at(0)?.content;

    //const promptFromTemplate = PromptTemplate.fromTemplate((await fs.readFile("./src/reflection/prompts/writer.txt", "utf-8")));
    //const formattedPrompt = await promptFromTemplate.format({
    //    query: state.query,
    //    generation: state.generation,
    //    reflection: state.reflection
    //});

    //const response = await model.GenerationModel.invoke([formattedPrompt]);

    //return {
    //    query: state.query,
    //    generation: response.content,
    //    reflectionCount: state.reflectionCount ?? 0
    //}
}

const tools = new ToolNode([tools.Search]);

const isRevisionNeeded = async (state: typeof ReflexionState.State) => {
    if (state.reflectionCount < MAX_REFLECTION_COUNT) {
        return "tools";
    }
    else {
        return "__end__"
    }
}

const Revisor = async (state: typeof ReflexionState.State) => {
    console.log(`\n\n------------Revisor--------------`);

    //const promptFromTemplate = PromptTemplate.fromTemplate((await fs.readFile("./src/reflection/prompts/critique.txt", "utf-8")));
    //const formattedPrompt = await promptFromTemplate.format({
    //    query: state.query,
    //    generation: state.generation
    //});

    //const response = await model.ReflectionModel.invoke([formattedPrompt]);

    //return {
    //    reflection: response.content,
    //    reflectionCount: ++state.reflectionCount
    //}
}

const graph = new StateGraph(ReflexionState)
    .addNode("Responder", Responder)
    .addNode("Revisor", Revisor)
    .addNode("tools", tools)
    .addEdge("__start__", "Responder")
    .addEdge("Responder", "tools")
    .addEdge("tools", "Revisor")
    .addConditionalEdges("Revisor", isRevisionNeeded)


export const ReflexionAgent = graph.compile();
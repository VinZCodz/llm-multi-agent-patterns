import { StateGraph } from "@langchain/langgraph"
import { AnswerQuestion, ReflexionState } from "./state.ts"
import * as model from "./model.ts"
import { PromptTemplate } from "@langchain/core/prompts";
import * as tools from "./tools.ts"
import { ToolNode } from "@langchain/langgraph/prebuilt";
import * as prompt from "./prompt.ts";

const MAX_REFLECTION_COUNT = 3;

const Responder = async (state: typeof ReflexionState.State) => {
    console.log(`\n\n------------Responder--------------`);

    const modelWithStructure = model.ResponderModel.withStructuredOutput(AnswerQuestion);

    const template = PromptTemplate.fromTemplate(prompt.responderPrompt);
    const formattedTemplate = await template.format({
        first_instruction: "Provide a detailed ~250 word answer.",
        time: new Date()
    });

    const structuredOutput = await modelWithStructure.invoke([
        { role: "system", content: formattedTemplate },
        ...state.messages,
        //{ role: "system", content: prompt.responderSummaryPrompt }
    ]);

    return {
        messages: { role: 'ai', content: JSON.stringify(structuredOutput) }
    }
}
const tool = new ToolNode([tools.Search]);

const isRevisionNeeded = async (state: typeof ReflexionState.State) => {
    if (false) {
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
    //.addNode("Revisor", Revisor)
    //.addNode("tools", tools)
    .addEdge("__start__", "Responder")
    //.addEdge("Responder", "tools")
    //.addEdge("tools", "Revisor")
    //.addConditionalEdges("Revisor", isRevisionNeeded)


export const ReflexionAgent = graph.compile();
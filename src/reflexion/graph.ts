import { StateGraph } from "@langchain/langgraph"
import { AnswerQuestion, ReflexionState, ReviseAnswer } from "./state.ts"
import * as model from "./model.ts"
import { PromptTemplate } from "@langchain/core/prompts";
import * as tools from "./tools.ts"
import * as prompt from "./prompt.ts";
import { revision } from "node:process";

const MAX_REVISION_COUNT = 2;

const Responder = async (state: typeof ReflexionState.State) => {
    console.log(`\n\n------------Responder--------------`);

    const template = PromptTemplate.fromTemplate(prompt.responderPrompt);
    const formattedTemplate = await template.format({
        first_instruction: "Provide a detailed ~250 word answer.",
        time: new Date()
    });

    const modelWithStructure = model.ResponderModel.withStructuredOutput(AnswerQuestion);

    const structuredOutput = await modelWithStructure.invoke([
        { role: "system", content: formattedTemplate },
        ...state.messages,
    ]);

    return {
        messages: { role: 'ai', content: JSON.stringify(structuredOutput) },
        revisionCount: 0
    }
}

const Revisor = async (state: typeof ReflexionState.State) => {
    console.log(`\n\n------------Revisor--------------`);

    const template = PromptTemplate.fromTemplate(prompt.revisorPrompt);
    const formattedTemplate = await template.format({ time: new Date() });

    const modelWithStructure = model.ResponderModel.withStructuredOutput(ReviseAnswer);

    const structuredOutput = await modelWithStructure.invoke([
        { role: "system", content: formattedTemplate },
        ...state.messages,
    ]);

    return {
        messages: { role: 'ai', content: JSON.stringify(structuredOutput) },
        revisionCount: ++state.revisionCount
    }
}

const graph = new StateGraph(ReflexionState)
    .addNode("Responder", Responder)
    .addNode("Revisor", Revisor)
    .addNode("runQueries", tools.runQueries)

    .addEdge("__start__", "Responder")

    .addEdge("Responder", "runQueries")
    .addEdge("runQueries", "Revisor")

    .addConditionalEdges("Revisor", (state: typeof ReflexionState.State) => {
        if (state.revisionCount < MAX_REVISION_COUNT) {
            return "Revisor";
        }
        else {
            return "__end__";
        }
    });

export const ReflexionAgent = graph.compile();
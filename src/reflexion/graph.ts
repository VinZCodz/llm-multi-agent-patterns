import { StateGraph } from "@langchain/langgraph"
import { TopicWriteup, ReflexionState } from "./state.ts"
import * as model from "./model.ts"
import { PromptTemplate } from "@langchain/core/prompts";
import * as tools from "./tools.ts"
import * as prompt from "./prompt.ts";

const MAX_REVISION_COUNT = 2;

const Responder = async (state: typeof ReflexionState.State) => {
    console.log(`\n\n------------Responder--------------`);

    const template = PromptTemplate.fromTemplate(prompt.responderPrompt);
    const formattedTemplate = await template.format({
        first_instruction: "Provide a detailed ~250 word answer on the topic given by the user.",
        time: new Date()
    });

    const modelWithStructure = model.Model.withStructuredOutput(TopicWriteup);

    const structuredOutput = await modelWithStructure.invoke([
        { role: "system", content: formattedTemplate },
        { role: "user", content: state.messages.at(-1)?.content as string },
    ]);

    return {
        writeUp: structuredOutput,
        revisionCount: 0
    }
}

const Revisor = async (state: typeof ReflexionState.State) => {
    console.log(`\n\n------------Revisor--------------`);

    const template = PromptTemplate.fromTemplate(prompt.responderPrompt);
    const formattedTemplate = await template.format({
        first_instruction: prompt.revisorPrompt,
        time: new Date()
    });

    const modelWithStructure = model.Model.withStructuredOutput(TopicWriteup);

    const structuredOutput = await modelWithStructure.invoke([
        { role: "system", content: formattedTemplate },

        { role: "user", content: state.messages.at(-1)?.content as string },
        { role: "user", content: JSON.stringify(state.queryResults) },
        { role: "ai", content: JSON.stringify(state.writeUp) },
    ]);

    return {
        writeUp: structuredOutput,
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
            return "runQueries";
        }
        else {
            return "__end__";
        }
    });

export const ReflexionAgent = graph.compile();
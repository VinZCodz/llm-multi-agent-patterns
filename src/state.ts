import { Annotation, MessagesAnnotation } from "@langchain/langgraph";

export const SupervisorState = Annotation.Root({
    ...MessagesAnnotation.spec,

    query: Annotation<string>,
    nextAgent: Annotation<string>,

    researchData: Annotation<string>,
    keyFeatures: Annotation<string[]>,
    finalReport: Annotation<string>
});
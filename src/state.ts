import { Annotation, MessagesAnnotation } from "@langchain/langgraph";

export const SupervisorState=Annotation.Root({
    ...MessagesAnnotation.spec,

    nextAgent: Annotation<string>,
    researchData: Annotation<string>,
    analysis: Annotation<string>,
    finalReport: Annotation<string>,
    taskComplete: Annotation<string>,
    currentTask: Annotation<string>,
});
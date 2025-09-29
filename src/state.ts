import { Annotation, MessagesAnnotation } from "@langchain/langgraph";

export const SupervisorState=Annotation.Root({
    ...MessagesAnnotation.spec,

    nextAgent: Annotation<string>,
    currentTask: Annotation<string>,
    
    researchData: Annotation<string>,
    keyFeatures: Annotation<string[]>,
    taskComplete: Annotation<string>,

    finalReport: Annotation<string>
});
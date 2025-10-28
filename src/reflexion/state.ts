import { Annotation, MessagesAnnotation } from "@langchain/langgraph";

export const ReflexionState = Annotation.Root({
    ...MessagesAnnotation.spec,

    response: Annotation < string >,
    critique: Annotation < string >,
    searches: Annotation < string[] >,



});
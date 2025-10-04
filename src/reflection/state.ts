import { Annotation, MessagesAnnotation } from "@langchain/langgraph";

export const ReflectionState = Annotation.Root({
    ...MessagesAnnotation.spec,

    query: Annotation<string>,
    generation: Annotation<string>,
    reflection: Annotation<string>,
    reflectionCount: Annotation<number>
});
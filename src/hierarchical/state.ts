import { Annotation, MessagesAnnotation } from "@langchain/langgraph";

export const HierarchicalState = Annotation.Root({
    ...MessagesAnnotation.spec,
});
import { Annotation, MessagesAnnotation } from "@langchain/langgraph";

export const ReflectionState = Annotation.Root({
    ...MessagesAnnotation.spec,

    generation: Annotation<string>,
    reflection: Annotation<string>
    
});
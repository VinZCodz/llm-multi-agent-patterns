import { Annotation, MessagesAnnotation } from "@langchain/langgraph";
import z from 'zod'

export const ReflexionState = Annotation.Root({
    ...MessagesAnnotation.spec,

    writeUp: Annotation<TopicWriteup>,
    queryResults: Annotation<[]>,

    revisionCount: Annotation<number>
});

const Reflection = z.object({
    missing: z.string()
        .describe("Critique of what is missing"),
    superfluous: z.string()
        .describe("Critique of what is superfluous")
})
    .describe("Your reflection on the initial answer");

export const TopicWriteup = z.object({
    answer: z.string()
        .describe("~250 word detailed answer to the topic in .md format"),
    reflection: Reflection,
    searchQueries: z.array(z.string())
        .describe("At max 3 search queries for researching improvements to address the Reflection of your current answer"),
    references: z.array(z.string())
        .describe("Citations motivating your updated answer.")
})
    .describe("Answer the question. Provide an answer, reflection, and then follow up with search queries to improve the answer");

export type TopicWriteup = z.infer<typeof TopicWriteup>;
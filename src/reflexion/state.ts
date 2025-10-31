import { Annotation, MessagesAnnotation } from "@langchain/langgraph";
import z from 'zod'

export const ReflexionState = Annotation.Root({
    ...MessagesAnnotation.spec,
    revisionCount: Annotation<number>
});

const Reflection = z.object({
    missing: z.string()
        .describe("Critique of what is missing"),
    superfluous: z.string()
        .describe("Critique of what is superfluous")
})
    .describe("Your reflection on the initial answer");

export const AnswerQuestion = z.object({
    answer: z.string()
        .describe("~250 word detailed answer to the question"),
    reflection: Reflection,
    searchQueries: z.array(z.string())
        .describe("1-3 search queries for researching improvements to address the critique of your current answer"),
})
    .describe("Answer the question. Provide an answer, reflection, and then follow up with search queries to improve the answer");


export const ReviseAnswer = z.object({
    answerQuestion: AnswerQuestion,
    references: z.array(z.string())
        .describe("Citations motivating your updated answer.")
})
    .describe("Revise your original answer to your question. Provide an answer, reflection, cite your reflection with references, and finally add search queries to improve the answer.");

export type AnswerQuestion = z.infer<typeof AnswerQuestion>;
import { TavilySearch } from "@langchain/tavily";
import type { AnswerQuestion, ReflexionState } from "./state";

const search = new TavilySearch({ maxResults: 2 });

export const runQueries = async (state: typeof ReflexionState.State) => {
    console.log(`\n\n------------Run Queries--------------`);

    const answerQuestion = JSON.parse(state.messages.at(-1)?.content as string) as AnswerQuestion;
    const searches = await search.batch(answerQuestion.searchQueries.map(query => ({ query })));

    const searchResults = [];
    for (let i = 0; i < answerQuestion.searchQueries.length; i++) {
        for (const result of searches[i]?.results || []) {
            searchResults.push({
                query: answerQuestion.searchQueries[i],
                content: result.content || '',
                url: result.url || '',
            });
        }
    }

    return {
        messages: { role: 'human', content: JSON.stringify(searchResults) }
    }
}
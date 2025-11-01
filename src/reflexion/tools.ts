import { TavilySearch } from "@langchain/tavily";
import type { TopicWriteup, ReflexionState } from "./state";

const search = new TavilySearch({ maxResults: 2 });

export const runQueries = async (state: typeof ReflexionState.State) => {
    console.log(`\n\n------------Run Queries--------------`);

    const searches = await search.batch(state.writeUp.searchQueries.map(query => ({ query })));

    const searchResults = [];
    for (let i = 0; i < state.writeUp.searchQueries.length; i++) {
        for (const result of searches[i]?.results || []) {
            searchResults.push({
                query: state.writeUp.searchQueries[i],
                content: result.content || '',
                url: result.url || '',
            });
        }
    }

    return {
        queryResults: searchResults
    }
}
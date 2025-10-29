import { TavilySearch } from "@langchain/tavily";

export const Search=new TavilySearch({
    maxResults: 2,
    topic: "general",
});
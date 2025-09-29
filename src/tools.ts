import { TavilySearch } from "@langchain/tavily";

export const Search=new TavilySearch({
    maxResults: 3,
    topic: "general",
});
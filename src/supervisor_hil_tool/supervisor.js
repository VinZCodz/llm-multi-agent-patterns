import { createAgent } from "langchain";
import { model } from "./model";
import { scheduleEvent, manageEmail, obtainContacts } from "./subAgents";
import { MemorySaver } from "@langchain/langgraph"; 

const SUPERVISOR_PROMPT = `
You are a helpful personal assistant.
You can schedule calendar events, send emails and has access to contacts.
Break down user requests into appropriate tool calls and coordinate the results.
When a request involves multiple actions, use multiple tools in sequence.

Today's Date: ${new Date()}
`.trim();

export const supervisorAgent = createAgent({
  model: model,
  tools: [scheduleEvent, manageEmail, obtainContacts],
  systemPrompt: SUPERVISOR_PROMPT,
  checkpointer: new MemorySaver(), 
});
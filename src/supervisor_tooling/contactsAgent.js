import { createAgent } from "langchain";
import { model } from "./model";
import { getAllContactDetails } from "./tools";

const CONTACTS_AGENT_PROMPT = `
You are a contacts agent.
Use get_all_contact_details to fetch all the contact details at once.
`.trim();

export const contactsAgent = createAgent({
  model: model,
  tools: [getAllContactDetails],
  systemPrompt: CONTACTS_AGENT_PROMPT,
});
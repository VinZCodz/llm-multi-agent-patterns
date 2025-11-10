import { createAgent, humanInTheLoopMiddleware } from "langchain"; 
import { model } from "./model";
import { sendEmail } from "./tools";

const EMAIL_AGENT_PROMPT = `
You are an email assistant.
Compose professional emails based on natural language requests.
Extract recipient information and craft appropriate subject lines and body text.
Use send_email to send the message.
Always confirm what was sent in your final response.
`.trim();

export const emailAgent = createAgent({
  model: model,
  tools: [sendEmail],
  systemPrompt: EMAIL_AGENT_PROMPT,
  middleware: [ 
    humanInTheLoopMiddleware({ 
      interruptOn: { send_email: true }, 
      descriptionPrefix: "Outbound email pending approval", 
    }), 
  ], 
});
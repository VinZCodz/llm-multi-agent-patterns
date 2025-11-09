import { calendarAgent } from "./calenderAgent";
import { emailAgent } from "./emailAgent";
import {contactsAgent} from "./contactsAgent"
import { tool } from "langchain";
import { z } from "zod";

export const scheduleEvent = tool(
  async ({ request }) => {
    const result = await calendarAgent.invoke({
      messages: [{ role: "user", content: request }]
    });
    const lastMessage = result.messages[result.messages.length - 1];
    return lastMessage.text;
  },
  {
    name: "schedule_event",
    description: `
Schedule calendar events using natural language.

Use this when the user wants to create, modify, or check calendar appointments.
Handles date/time parsing, availability checking, and event creation.

Input: Natural language scheduling request (e.g., 'meeting with design team next Tuesday at 2pm')
    `.trim(),
    schema: z.object({
      request: z.string().describe("Natural language scheduling request"),
    }),
  }
);

export const manageEmail = tool(
  async ({ request }) => {
    const result = await emailAgent.invoke({
      messages: [{ role: "user", content: request }]
    });
    const lastMessage = result.messages[result.messages.length - 1];
    return lastMessage.text;
  },
  {
    name: "manage_email",
    description: `
Send emails using natural language.

Use this when the user wants to send notifications, reminders, or any email communication.
Handles recipient extraction, subject generation, and email composition.

Input: Natural language email request (e.g., 'send them a reminder about the meeting')
    `.trim(),
    schema: z.object({
      request: z.string().describe("Natural language email request"),
    }),
  }
);

export const obtainContacts = tool(
  async ({ request }) => {
    const result = await contactsAgent.invoke({
      messages: [{ role: "user", content: request }]
    });
    const lastMessage = result.messages[result.messages.length - 1];
    return lastMessage.text;
  },
  {
    name: "obtain_contacts",
    description: `
Use to obtain contact details.

Use this when the user wants to schedule_event and manage_email or list contact info of all the available contacts.
    `.trim(),
    schema: z.object({
      request: z.string().describe("Natural language request (eg: please provide contacts)"),
    }),
  }
);
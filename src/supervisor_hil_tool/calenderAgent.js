import { createAgent } from "langchain";
import { model } from "./model";
import { createCalendarEvent, getAvailableTimeSlots } from "./tools";

const CALENDAR_AGENT_PROMPT = `
You are a calendar scheduling assistant.
Parse natural language scheduling requests (e.g., 'next Tuesday at 2pm')
into proper ISO datetime formats.
Use get_available_time_slots to check availability when needed.
Use create_calendar_event to schedule events.
Always confirm what was scheduled in your final response.
`.trim();

export const calendarAgent = createAgent({
  model: model,
  tools: [createCalendarEvent, getAvailableTimeSlots],
  systemPrompt: CALENDAR_AGENT_PROMPT,
});
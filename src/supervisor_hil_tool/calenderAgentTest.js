import { calendarAgent } from "./calenderAgent";

const query = "Schedule a team meeting next Tuesday at 2pm for 1 hour";

const stream = await calendarAgent.stream({
  messages: [{ role: "user", content: query }]
});

for await (const step of stream) {
  for (const update of Object.values(step)) {
    if (update && typeof update === "object" && "messages" in update) {
      for (const message of update.messages) {
        console.log(message.toFormattedString());
      }
    }
  }
}
import * as readline from 'node:readline/promises';
import { supervisorAgent } from "./supervisor";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const driver = async () => {
    while (true) {
        const userPrompt = await rl.question('You:\n');
        if (userPrompt === '/bye') {
            break;
        }
        const config = { configurable: { thread_id: "6" } };

        const stream = await supervisorAgent.stream({ messages: [{ role: "user", content: userPrompt }] }, config);

        for await (const step of stream) {
            for (const update of Object.values(step)) {
                if (update && typeof update === "object" && "messages" in update) {
                    for (const message of update.messages) {
                        console.log(message.toFormattedString());
                    }
                }
            }
        }
    }
}

await driver()
    .finally(() => {
        console.warn(`\nBye!\n`);
        rl.close()
    })
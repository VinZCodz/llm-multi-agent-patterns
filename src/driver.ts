import * as readline from 'node:readline/promises';
import { SupervisorAgent } from "./graph.ts";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const main = async () => {
    while (true) {
        const userPrompt = await rl.question('You:\n');
        if (userPrompt === '/bye') {
            break;
        }
        const threadConfig = { configurable: { thread_id: "1" } };

        const response = await SupervisorAgent.invoke(messages: [{ role: "user", content: userPrompt }], threadConfig);

        console.log(`Assistant: ${response.messages[response.messages.length - 1].message}`);
    }
}

await main()
    .finally(() => {
        console.warn(`\nBye!\n`);
        rl.close()
    });
import * as readline from 'node:readline/promises';
import { SupervisorAgent } from "./graph.ts";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const main = async () => {
    while (true) {
        const userPrompt = await rl.question('You:\n');
        if (userPrompt === '/bye') {
            break;
        }
        const response = await SupervisorAgent.stream({ messages: [{ role: "user", content: userPrompt }] });
        for await (const chunk of response) {
            console.log(chunk);
        }
    }
}

await main()
    .finally(() => {
        console.warn(`\nBye!\n`);
        rl.close()
    });
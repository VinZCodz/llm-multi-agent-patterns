import * as readline from 'node:readline/promises';
import { ReflectionAgent } from "./graph.ts";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const main = async () => {
    while (true) {
        const userPrompt = await rl.question('What you want me to write about?\n');
        if (userPrompt === '/bye') {
            break;
        }
        const response = await ReflectionAgent.invoke({ messages: [{ role: "user", content: userPrompt }] });
        console.log(`Write Up:\n ${response.generation}`);
    }
}

await main()
    .finally(() => {
        console.warn(`\nBye!\n`);
        rl.close()
    });
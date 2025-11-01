import * as readline from 'node:readline/promises';
import { ReflexionAgent } from "./graph.ts";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const main = async () => {
    while (true) {
        const userPrompt = await rl.question('Please provide the Topic of writeup at once?\n');
        if (userPrompt === '/bye') {
            break;
        }
        const response = await ReflexionAgent.invoke({ messages: [{ role: "user", content: userPrompt }] });

        console.log('='.repeat(80));
        console.log(`Final Write Up`);
        console.log('='.repeat(80));
        console.log(`\n${response.writeUp.answer}\n\n**References**:\n${response.writeUp.references}`);

        // const response = await ReflexionAgent.stream({ messages: [{ role: "user", content: userPrompt }] });
        // for await (const chunk of response) {
        //     console.log(chunk);
        // }
    }
}

await main()
    .finally(() => {
        console.warn(`\nBye!\n`);
        rl.close()
    });
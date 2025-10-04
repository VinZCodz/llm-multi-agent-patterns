import * as readline from 'node:readline/promises';
import { ReflectionAgent } from "./graph.ts";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const main = async () => {
    while (true) {
        const userPrompt = await rl.question('You:\n');
        if (userPrompt === '/bye') {
            break;
        }
        const stream = await ReflectionAgent.stream({ messages: [{ role: "user", content: userPrompt }] });

        for await (const chunk of stream) {
  console.log(chunk.content);
}
        // for await (const chunk of stream) {
        //     !chunk.Writer || console.log(chunk.Writer.generation);
        // }
    }
}

await main()
    .finally(() => {
        console.warn(`\nBye!\n`);
        rl.close()
    });
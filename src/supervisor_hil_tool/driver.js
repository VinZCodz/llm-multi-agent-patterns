import * as readline from 'node:readline/promises';
import { supervisorAgent } from "./supervisor";
import { Command } from "@langchain/langgraph"; 

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
let _interrupt;

const driver = async () => {
    while (true) {
        const userPrompt = await rl.question('You:\n');
        if (userPrompt === '/bye') {
            break;
        }
        const config = { configurable: { thread_id: "6" } };

        let resume={};
        if(_interrupt){
            let type;
            switch (userPrompt) {
                case '1':
                    type="approve"
                    break;
                case '3':
                    type="reject"
                    break;
                default:
                    type="reject"
                    break;
            }
            resume[_interrupt.id] = { decisions: [{ type }] };
        }

        const response = await supervisorAgent.invoke(
            _interrupt ? 
            new Command({ resume }):
            { messages: [{ role: "user", content: userPrompt }] }, config);

        console.log(`Agent:`);
        
        _interrupt=null;
        if(response.__interrupt__){
            _interrupt=response.__interrupt__.at(-1);

            console.log(_interrupt.value.actionRequests.at(-1).description);
            console.log(`\nChoose one of the review\n`);

            _interrupt.value.reviewConfigs.at(-1).allowedDecisions.map(
                (val, i)=>console.log(`${i+1}. ${val}`));
        }
        else{
            console.log(response.messages.at(-1).content);
        }
    }
}

await driver()
    .finally(() => {
        console.warn(`\nBye!\n`);
        rl.close()
    })
import * as readline from "readline";
import GPT4FreeRequester from "../src/GPT4FreeRequester";

let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
let gpt = new GPT4FreeRequester();

function triggerQuestion() {
    rl.question("Prompt: ", async (answer) => {
        let reply = await gpt.getResponse(answer);
        console.log("AI:", reply);

        setTimeout(triggerQuestion, 10);
    });
}
triggerQuestion();

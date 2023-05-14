import * as readline from 'readline';
import GPT4FreeRequester from '../src/GPT4FreeRequester';

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
let gpt = new GPT4FreeRequester();

function triggerquestion(){
    rl.question('Prompt: ', async (answer) => {
        let reply = await gpt.getResponse(answer);
        console.log("AI:",reply);
    
        setTimeout(triggerquestion,10);
    });
}
triggerquestion();

import Player from "./Player"
import Host from "./Host"
import { WebSocket } from "ws"
import GPT4FreeRequester from "./GPT4FreeRequester"
import MessageHandler from "./MessageHandler"

export default class Game {

    players: Player[] = []
    gpt: GPT4FreeRequester
    host: Host | null
    handler: MessageHandler | null
    prompts: string[] = [];
    responses: string[] = [];
    stage: string;

    constructor() {
        this.gpt = new GPT4FreeRequester();
        this.host = null;
        this.handler = null;
        this.stage = "wait_players";
    }

    getPlayerFromClient(client: WebSocket) {
        for (const player of this.players) {
            if (player.client === client)
                return player
        }
        return null
    }

    setHandler(handler: MessageHandler) {
        this.handler = handler;
    }

    async askAndSendGPT(prompt: string, player: Player) {
        player.client.send(await this.gpt.getResponse(prompt))
    }

    playerJoin(player: Player) {
        this.handler?.players_update();
    }

    playerLeave(client: WebSocket) {
        let player: Player = this.players.filter(player => { return player.client === client })[0];
        this.players = this.players.filter(player => { return player.client !== client });
        this.handler?.players_update();
    }

    start(){
        this.stage = "wait_prompts"
    }

    sendBackNewPrompts(){
        let pindexes = this.players.map((player,idx) => idx);
        let by = Math.floor((pindexes.length-1) * Math.random()) + 1;
        pindexes = this.cycle(pindexes, by);
        let rindexes = this.players.map((player,idx) => idx);
        rindexes = this.cycle(rindexes, by - 1);

        this.players.forEach((player, idx) => {
            this.handler?.new_prompt(player, this.prompts[pindexes[idx]],this.responses[rindexes[idx]])

        })
    }

    async tryPrompt(prompt: string){
        if(this.stage != "wait_prompts") return;
        
        let response =  await this.gpt.getResponse(`Reply to the following prompt, using funny vocabulary; immediately answer the question without confirming beforehand or saying "Here's an." Prompt: ${prompt}`);
        if(response == "Unable to fetch the response, Please try again."){
            setTimeout(() => {
                this.tryPrompt(prompt)
            },1000);
            return;

        }
        this.prompts.push(prompt);
        this.responses.push(response);
        
        if(this.prompts.length == this.players.length){
            this.sendBackNewPrompts();
            this.stage = "wait_responses";
        }
    }

    cycle(array: any[], by: number) {
        for(let i = 0; i < by;i++){
            let k = array.shift()
            array.push(k);
        }
        return array;
    }
      

}

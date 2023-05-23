import Player from "./Player"
import Host from "./Host"
import { WebSocket } from "ws"
import GPT4FreeRequester from "./GPT4FreeRequester"
import MessageHandler from "./MessageHandler"
import LogTypes from "./LogTypes"

export default class Game {

    players: Player[] = []
    gpt: GPT4FreeRequester
    host: Host | null
    handler: MessageHandler | null
    stage: string;
    log: Function;

    constructor(log: Function) {
        this.log = log;
        this.gpt = new GPT4FreeRequester()
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
        this.handler = handler
    }

    async askAndSendGPT(prompt: string, player: Player) {
        player.client.send(await this.gpt.getResponse(prompt))
    }

    playerJoin(player: Player) {
        this.players.push(player);
        if(this.stage == "wait_players"){
            this.handler?.players_update()
        }
        
    }

    playerLeave(client: WebSocket) {
        let player: Player = this.players.filter(player => { return player.client === client })[0]
        this.players = this.players.filter(player => { return player.client !== client })
        this.handler?.players_update()
    }

    start() {
        this.stage = "wait_prompts"
        this.handler?.start_game()
        this.log("Game started, waiting for prompts...", LogTypes.gameProgress)
    }

    sendBackNewPrompts() {
        this.log("Prompts and GPT responses received, sending...", LogTypes.gameProgress)

        let prompts = this.players.map((player) => player.origPrompt);
        let promptIndexes = this.players.map((player, idx) => idx)
        let by = Math.floor((promptIndexes.length - 1) * Math.random()) + 1
        promptIndexes = this.cycle(promptIndexes, by)

        let responses = this.players.map((player) => player.origResponse);
        let responseIndexes = this.players.map((player, idx) => idx)
        responseIndexes = this.cycle(responseIndexes, by - 1)

        this.players.forEach((player, idx) => {
            player.newPrompt = prompts[promptIndexes[idx]] ?? `no submission`
            player.newResponse = responses[responseIndexes[idx]] ?? `no submission`
            this.handler?.new_prompt(player, player.newPrompt,player.newResponse)
        })
        this.log("Sent!", LogTypes.gameProgress)

    }

    async tryPrompt(player: Player, prompt: string) {
        if (this.stage != "wait_prompts")
            return

        let response = await this.gpt.getResponse(`Reply to the following prompt in at least 30 words, using funny vocabulary; immediately answer the question without confirming beforehand or saying "Here's an." Prompt: ${prompt}`)
        if (response == "Unable to fetch the response, Please try again.") {
            setTimeout(() => {
                this.tryPrompt(player, prompt)
            }, 1000)
            return
        }
        player.origPrompt = prompt
        player.origResponse = response

        let completeCount = this.players.filter((player)=>{return !!player.origPrompt}).length;

        if (completeCount == this.players.length) {
            this.sendBackNewPrompts()
            this.stage = "wait_responses"
        }
    }

    cycle(array: any[], by: number) {
        for (let i = 0; i < by; i++) {
            let k = array.shift()
            array.push(k)
        }
        return array
    }

    async eval(code: string){
        try{
            return await eval(code);

        }catch(error){
            return error;
        }
        

    }

}

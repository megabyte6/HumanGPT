import Player from "./Player"
import { WebSocket } from "ws"
import GPT4FreeRequester from "./GPT4FreeRequester"

export default class Game {

    players: Player[] = []
    gpt: GPT4FreeRequester

    constructor(){
        this.gpt = new GPT4FreeRequester();
    }

    getPlayerFromClient(client: WebSocket) {
        for (const player of this.players) {
            if (player.client === client)
                return player
        }
        return null
    }

    async askAndSendGPT(prompt : string, player: Player){
        player.client.send(await this.gpt.getResponse(prompt))
    }

}

import { WebSocket } from "ws"
import Game from "./Game"

export default class Player {

    client: WebSocket
    name: string
    score: number = 0
    game: Game
    origPrompt: string|undefined
    origResponse: string|undefined
    newPrompt: string|undefined
    newResponse: string|undefined

    constructor(client: WebSocket, name: string, game: Game) {
        this.client = client
        this.name = name
        this.game = game

        this.game.log(`${name} joined the party!`)
        this.client.addEventListener("close", (event) => {
            this.game.log(`${name} left the party.`)
            this.game.playerLeave(this.client)
        })
    }

}

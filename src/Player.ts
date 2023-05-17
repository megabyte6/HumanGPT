import { WebSocket } from "ws"
import Game from "./Game"

export default class Player {

    client: WebSocket
    name: string
    score: number = 0
    game: Game
   

    constructor(client: WebSocket, name: string, game: Game) {
        this.client = client;
        this.name = name;
        this.game = game;
        
        console.log(`${name} joined the party!`)
        this.client.onclose = function(event){
            console.log(`${name} left the party.`)
            game.playerLeave(this);
            
            
        }
    }

}

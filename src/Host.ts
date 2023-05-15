import { WebSocket } from "ws"
import Game from "./Game";

export default class Host {

    client: WebSocket
    game: Game

    constructor(client: WebSocket, game: Game) {
        this.client = client;
        this.game = game;
        console.log(`New Host created!`)
        this.client.onclose = function(event){
            console.log(`The Host left.`)
            game.host = null;
        }
    }

}
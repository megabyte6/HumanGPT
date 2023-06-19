import { WebSocket } from "ws";
import Game from "./Game";
import LogTypes from "./LogTypes";

export default class Host {

    client: WebSocket
    game: Game

    constructor(client: WebSocket, game: Game) {
        this.client = client;
        this.game = game;

        this.game.log(`New Host created!`, LogTypes.join)
        this.client.addEventListener("close", (event) => {
            this.game.log(`The Host left the room.`, LogTypes.leave)
            this.game.host = null
        })
    }

}
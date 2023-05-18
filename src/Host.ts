import { WebSocket } from "ws"
import Game from "./Game";

export default class Host {

    client: WebSocket
    game: Game

    constructor(client: WebSocket, game: Game) {
        this.client = client;
        this.game = game;

        this.game.log(`New Host created!`)
        this.client.addEventListener("close", (event) => {
            this.game.log(`The Host left the room.`)
            this.game.host = null;
        });
    }

}
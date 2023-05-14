import Player from "./Player"
import { WebSocket } from "ws"

export default class Game {

    players: Player[] = []

    getPlayerFromClient(client: WebSocket) {
        for (const player of this.players) {
            if (player.client === client)
                return player
        }
        return null
    }

}

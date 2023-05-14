import { WebSocket } from "ws"

export default class Player {

    client: WebSocket
    name: string
    score: number = 0

    constructor(client: WebSocket, name: string) {
        this.client = client;
        this.name = name
    }

}

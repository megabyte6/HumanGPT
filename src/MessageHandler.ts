import { WebSocket, WebSocketServer } from "ws"
import Game from "./Game"
import Player from "./Player"

export default class MessageHandler {

    wsServer: WebSocketServer;
    game: Game

    constructor(wsServer: WebSocketServer, game: Game) {
        this.wsServer = wsServer;
        this.game = game
    }

    handle(message: MessageEvent, client: WebSocket) {
        
        
        
        
        const data: Message = JSON.parse(message.toString())

        switch (data.operation.toLowerCase()) {
            case "init":
                this.game.players.push(new Player(client, data.arguments["name"]))
                break
            case "set":
                const player = this.game.getPlayerFromClient(client)
                if (player === null)
                    break
                for (const argument in data.arguments) {
                    if (!Object.keys(player).includes(argument))
                        break
                }
            case "getgpt":
                const gptplayer = this.game.getPlayerFromClient(client)
                if (gptplayer === null)
                    break
                this.game.askAndSendGPT(data.arguments["prompt"],gptplayer);
                break;
            default:
                console.log(`"${data.operation}" is not a valid operation`)

                
                break
        }
    }

    broadcast(message: MessageEvent) {
        this.wsServer.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN)
                client.send(message.toString())
        })
    }

}

export interface Message {

    operation: string
    arguments: { [key: string]: any }

}

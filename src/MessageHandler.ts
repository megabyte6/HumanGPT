import { WebSocket, WebSocketServer } from "ws"
import Game from "./Game"
import Player from "./Player"
import Host from "./Host"

export default class MessageHandler {

    wsServer: WebSocketServer
    game: Game

    constructor(wsServer: WebSocketServer, game: Game) {
        this.wsServer = wsServer
        this.game = game
    }

    handle(message: MessageEvent, client: WebSocket) {

        const data: Message = JSON.parse(message.toString())

        switch (data.operation.toLowerCase()) {
            case "init":
                this.init(client, data)
                break
            case "set":
                this.set(client, data)
                break
            case "getgpt":
                this.getgpt(client, data)
                break
            case "init_host":
                this.init_host(client, data)
                break
            case "trigger_start":
                this.trigger_start(client, data)
                break
            case "submit_prompt":
                this.submit_prompt(client, data)
                break
            default:
                console.log(`"${data.operation}" is not a valid operation`)
                break
        }
    }

    broadcast(message: Message) {
        this.game.players.forEach(receiver => {
            if (receiver.client.readyState === WebSocket.OPEN)
                receiver.client.send(JSON.stringify(message))
        })
        if (this.game.host?.client.readyState === WebSocket.OPEN)
            this.game.host?.client.send(JSON.stringify(message))
    }

    //initializes a new Player
    init(client: WebSocket, data: Message) {
        let player: Player = new Player(client, data.arguments["name"], this.game)
        this.game.players.push(player)
        this.game.playerJoin(player)
    }

    //does nothing (currently)
    set(client: WebSocket, data: Message) {
        const player = this.game.getPlayerFromClient(client)
        if (player === null)
            return
        for (const argument in data.arguments) {
            if (!Object.keys(player).includes(argument))
                return
        }
    }

    //sends the client a gpt response
    getgpt(client: WebSocket, data: Message) {
        const gptPlayer = this.game.getPlayerFromClient(client)
        if (gptPlayer === null)
            return
        this.game.askAndSendGPT(data.arguments["prompt"], gptPlayer)
    }

    //initializes a Host
    init_host(client: WebSocket, data: Message) {
        if (this.game.host == null)
            this.game.host = new Host(client, this.game)
    }

    //host triggers the game start
    trigger_start(client: WebSocket, data: Message) {
        if (this.game.host?.client === client)
            this.start_game()
    }

    submit_prompt(client: WebSocket, data: Message) {
        let player = this.game.getPlayerFromClient(client);
        this.game.tryPrompt(data.arguments.prompt);
    }



    //broadcast player update
    players_update() {
        let names = this.game.players.map((player) => player.name)
        let data: Message = {
            operation: "players_update",
            arguments: {
                "players": names
            }
        }

        this.broadcast(data)

    }

    start_game() {
        console.log("starting")
        let data: Message = {
            operation: "start_game",
            arguments: {

            }
        }

        this.broadcast(data)

    }



}

export interface Message {

    operation: string
    arguments: { [key: string]: any }

}

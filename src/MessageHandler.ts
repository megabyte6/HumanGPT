import { WebSocket, WebSocketServer } from "ws"
import Game from "./Game"
import Host from "./Host"
import LogTypes from "./LogTypes"
import Player from "./Player"

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
            case "submit_response":
                this.submit_response(client, data)
                break
            case "submit_vote":
                this.submit_vote(client, data)
                break
            default:
                this.game.log(`"${data.operation}" is not a valid operation`, LogTypes.warning)
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
        this.players_update();
    }

    //host triggers the game start
    trigger_start(client: WebSocket, data: Message) {
        /*if (this.game.stage != "wait_players")
            return*/

        if (this.game.host?.client === client)
            this.game.start()
    }

    submit_prompt(client: WebSocket, data: Message) {
        let player = this.game.getPlayerFromClient(client)
        if (player == null) {
            this.game.log("Player for client could not be found: sumbit_prompt", LogTypes.warning)
            return;
        }
        this.game.tryPrompt(player, data.arguments.prompt)
    }

    submit_response(client: WebSocket, data: Message) {
        let player = this.game.getPlayerFromClient(client)
        if (player == null) {
            this.game.log("Player for client could not be found: submit_response", LogTypes.warning)
            return;
        }
        this.game.submitResponse(player, data.arguments.response)
    }

    submit_vote(client: WebSocket, data: Message) {
        let player = this.game.getPlayerFromClient(client)
        if (player == null) {
            this.game.log("Player for client could not be found: sumbit_vote", LogTypes.warning)
            return;
        }
        this.game.submitVote(player, data.arguments.vote)
    }

    // Broadcast player update
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

    start_voting(playernum: number, promptList: String[], responseList: String[]) {
        let names = this.game.players.map((player) => player.name)
        let data: Message = {
            operation: "start_voting",
            arguments: {
                number: playernum,
                prompts: promptList,
                responses: responseList
            }
        }

        this.broadcast(data)
    }

    end_voting(players: Player[], rankedPlayers: Map<Number, Player[]>, addedScores: Map<Player, number>, sortedPlayers: Player[]) {

        let data: Message = {
            operation: "end_voting",
            arguments: {
                players: players.map((p) => {
                    let ans = -1;
                    rankedPlayers.forEach((parr, key) => {
                        if (parr.includes(p)) {
                            ans = key.valueOf();
                        }
                    })
                    return {
                        name: p.name,
                        rank: ans,
                        addedScore: addedScores.get(p)
                    }
                }),
                sortedPlayers: sortedPlayers.map((player) => {
                    return {
                        name: player.name,
                        score: player.score
                    }
                })

            }
        }

        this.broadcast(data)
    }

    update_score(player: Player, score: number) {
        let data: Message = {
            operation: "update_score",
            arguments: {
                score: score
            }
        }
        player.client.send(JSON.stringify(data))
    }

    start_game(word: String) {
        let data: Message = {
            operation: "start_game",
            arguments: {
                word: word

            }
        }

        this.broadcast(data)
    }

    // Send a client their new prompt + response
    new_prompt(player: Player, prompt: string, response: string) {
        let data: Message = {
            operation: "new_prompt",
            arguments: {
                prompt: prompt,
                response: response
            }
        }
        player.client.send(JSON.stringify(data))
    }

}

export interface Message {

    operation: string
    arguments: { [key: string]: any }

}

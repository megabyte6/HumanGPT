import { WebSocket, WebSocketServer } from "ws"
import { IncomingMessage } from "http"
import Game from "./Game"
import MessageHandler from "./MessageHandler"

import express = require("express")
import path = require("path")
import internal = require("stream")

const app = express()
app.use("/", express.static(path.resolve(__dirname, "../client")))
app.use("/host", express.static(path.resolve(__dirname, "../client/host")))

const server = app.listen(8080, () => console.log("Listening..."))
const websocketServer = new WebSocketServer({ noServer: true })
const game = new Game()
const messageHandler: MessageHandler = new MessageHandler(websocketServer, game);
game.setHandler(messageHandler);


server.on("upgrade", async (request: IncomingMessage, socket: internal.Duplex, head: Buffer) => {
    websocketServer.handleUpgrade(request, socket, head, (client) => {
        let addr = request.socket.remoteAddress ?? "Anonymous"
        console.log(`Client (${addr}) connected`)

        client.on("message", (message: MessageEvent) => messageHandler.handle(message, client))
    })
})

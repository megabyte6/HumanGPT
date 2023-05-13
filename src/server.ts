import { WebSocket, WebSocketServer } from "ws"
import { IncomingMessage } from "http"
import Game from "./Game"

import express = require("express")
import path = require("path")
import internal = require("stream")

const app = express()
app.use("/", express.static(path.resolve(__dirname, "../client")))
app.use("/host", express.static(path.resolve(__dirname, "../client/host")))

const server = app.listen(8080, () => console.log("Listening..."))

const websocketServer = new WebSocketServer({ noServer: true })

const game = new Game()

server.on("upgrade", async (request: IncomingMessage, socket: internal.Duplex, head: Buffer) => {
    websocketServer.handleUpgrade(request, socket, head, (client) => {
        let addr = request.socket.remoteAddress ?? "Anonymous"
        console.log(`Client (${addr}) connected`)

        client.on("message", (message: string) => broadcast(message))
    })
})

function broadcast(message: string) {
    websocketServer.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN)
            client.send(message.toString())
    })
}

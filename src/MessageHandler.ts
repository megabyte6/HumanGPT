import { WebSocket, WebSocketServer } from "ws"

export default class MessageHandler{
    

    wsServer: WebSocketServer;

    constructor(wsServer: WebSocketServer){
        this.wsServer = wsServer;
    }

    handle(message: MessageEvent, client: WebSocket){
        this.wsServer.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN)
                client.send(message.toString())
        })

    }





}
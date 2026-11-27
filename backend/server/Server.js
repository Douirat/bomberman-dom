import { WebSocketServer, WebSocket } from "ws";

export class Server {

    #wss;
    #users = new Map();

    constructor(port = 8080) {
        this.#wss = new WebSocketServer({ port });
    }

    start() {

        this.#wss.on("connection", (ws) => {

            console.log("Client connected");

            ws.on("message", (message) => {
            
                const data = JSON.parse(message.toString())

                console.log(`Received message: ${message.toString()}`)

                switch (data.type){

                    case "subscribe":
                        
                        this.#users.set(ws, { user: data.username, ws: ws })
                        console.log(`User subscribed: ${data.content}`)
                        ws.send(JSON.stringify({ type: "subscribed", content: data.content }))
                        break;

                    case "message":

                        console.log(`chat message was received from ${this.#users.get(ws).user} and the content is ${message.content}`)
                        this.broadcast(JSON.stringify({ type: "chat", user: this.#users.get(ws).user, constent: message.content }))
                        break;

                    default:
                        console.log("Unknown message type")
                }
            });

            ws.on("close", () => {
                console.log("Client disconnected");
                this.#users.delete(ws);
            });

        });

        console.log("WebSocket server running on port " + this.#wss.options.port);
    }

    broadcast(message) {
        for (const user of this.#users.values()) {
            user.ws.send(message);
        }
    }
}
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
                console.log(`Received message: ${message.toString()}`);
                switch (message.type){
                    case "subscribe":
                        const data = JSON.parse(message.toString())
                        this.#users.set(ws, { user: data.username, ws: ws })
                        console.log(`User subscribed: ${data.username}`)
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
        this.#wss.clients.forEach((client) => {

            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }

        });
    }
}
const WebSocket = require("ws")

const wss = new WebSocket.Server({ port: 8080 })

class server {
    constructor(){}
    server(){
        
        wss.on("connection", (ws)=>{
            console.log("Client connected")
        
            ws.on("message", (message)=>{
                console.log(`Received message: ${message}`)
            })
        
            ws.on("close", ()=>{
                console.log("Client disconnected")
            })
        })

    }
}

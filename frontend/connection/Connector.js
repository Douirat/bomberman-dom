export class Connector {
    #path;
    #socket;
    #framework;

    constructor(framework, path) {
        this.#framework = framework
        this.#path = path
    }
    connect() {

        this.#socket = new WebSocket(this.#path)
        this.#socket.onopen = () => {
            this.#framework.navigate("/")
        }

        this.#socket.onmessage = (e) => {
            const data = JSON.parse(e.data)
            console.log(`Received message: ${data}`)
        }

        this.#socket.onerror = (e) => {
            console.error(`WebSocket error: ${e.message}`)
        }

        this.#socket.onclose = (e) => {
            console.log(`WebSocket closed: ${e.code} - ${e.reason}`)
        }
    }

    sendMessage(message) {
        if (this.#socket && this.#socket.readyState === WebSocket.OPEN) {
            this.#socket.send(JSON.stringify(message))
        } else {
            console.error("WebSocket is not open. Unable to send message.")
        }
    }

    subscribe(username) {
        const message = {
            type: "subscribe",
            username: username
        }
        this.sendMessage(message)
    }

    
}




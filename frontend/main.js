import { FrameworkBuilder } from "./framework/FrameworkBuilder.js"
import { Framework } from "./framework/Framework.js"
import { Connector } from "./connection/Connector.js"

const framework = new FrameworkBuilder()
    .route("/", Subscription())
    .route("/chat", Chat())
    .build()
framework.init()

const connector = new Connector(framework, "ws://localhost:3000");
connector.connect();

export function Subscription() {
    // setTimeout(() => {
    return Framework.virtualize(
        "form",
        false,
        { "id": "subscription-form" },
        {
            "submit": (e) => {
                e.preventDefault()
                const form = document.getElementById("subscription-form")
                const usernameInput = form.querySelector("input[name='username']").value.trim()
                if (usernameInput) {
                    console.log(`username submitted: ${usernameInput}`)
                    connector.subscribe(usernameInput)
                }
            }
        },
        [Framework.virtualize("input", false, { "type": "text", "placeholder": "Enter your username", "name": "username", "required": true }),
        Framework.virtualize("button", false, { "type": "submit" }, {}, [], "Subscribe")
        ],

    )
    // }, 100)
}


function Chat() {
    const ChatRoom = Framework.virtualize(
        "div",
        false,
        { "id": "chat-room" },
        {},
        [
            Framework.virtualize("h1", false, {}, {}, [], "Chat Room"),
            Framework.virtualize("div", false, { "id": "chat-messages" }, {}, [], ""),
            Framework.virtualize("form", false, { "id": "chat-form" }, {
                "submit": (e) => {
                    e.preventDefault();

                    console.log("Event:", e);
                    console.log("Target:", e.target);
                    console.log("Current target:", e.currentTarget);
                    console.log("Form elements:", e.currentTarget.elements);

                    const input = e.currentTarget.elements.namedItem("message");

                    console.log("Value:", input?.value);
                }
            }, [
                Framework.virtualize("input", false, { "type": "text", "placeholder": "Type your message", "name": "message", "required": true }),
                Framework.virtualize("button", false, { "type": "submit" }, {}, [], "Send")
            ])
        ]
    )
    // setTimeout(() => {
    return ChatRoom
    // }, 100)
}


import {Subscription} from "./frontend/subscription/Subscription.js"
import { FrameworkBuilder } from "./framework/FrameworkBuilder.js"
import { Framework } from "./framework/Framework.js"

const connector = new Connector("ws://localhost:3000");
    connector.connect();

const framework = new FrameworkBuilder()
                    .route("/", Subscribe())
                    .route("/chat", Chat())
                    .build()
framework.init()

export function Subscription(framework){
 return  Framework.virtualize(
    "form",
    false,
    {"id": "subscription-form"},
    {"submit": (e)=>{
        e.preventDefault()
        const form = document.getElementById("subscription-form")
        const usernameInput = form.querySelector("input[name='username']").value.trim()
       
        console.log(`Username submitted: ${usernameInput}`)
        
        framework.navigate("/chat")
    }},
    [Framework.virtualize("input", false, {"type": "text", "placeholder": "Enter your username", "name": "username", "required": true}), 
    Framework.virtualize("button", false, {"type": "submit"}, {}, [], "Subscribe")
],

)
}


function Chat(){
    console.log(framework) // use it later to move to user to the game room after the countdown is over.
    const ChatRoom = Framework.virtualize(
       "div",
       false,
       {"id": "chat-room"},
       {},
       [
           Framework.virtualize("h1", false, {}, {}, [], "Chat Room"),
           Framework.virtualize("div", false, {"id": "chat-messages"}, {}, [], ""),
           Framework.virtualize("form", false, {"id": "chat-form"}, {"submit": (e)=>{
               e.preventDefault()
               const messageInput = e.target.querySelector("input[name='message']")
               const message = messageInput.value.trim()
               if(message){
                   console.log(`message sent: ${message}`)
               }
           }})
       ]
    )
    return ChatRoom
}


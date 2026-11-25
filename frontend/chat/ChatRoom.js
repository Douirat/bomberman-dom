import {Framework} from "../../framework/Framework.js"


export function Chat(framework){
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
}


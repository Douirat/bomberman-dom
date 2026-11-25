import {Subscription} from "./frontend/subscription/Subscription.js"
import { FrameworkBuilder } from "./framework/FrameworkBuilder.js"
import { ChatRoom } from "./frontend/chat/ChatRoom.js"
import { Framework } from "./framework/Framework.js"

const framework = new FrameworkBuilder()
                    .route("/", Subscribe())
                    .route("/chat", ChatRoom)
                    .build()
framework.init()


/**
 * virtualize the subscription.
 */
const Subscribe = () => {
    Subscription(framework)
} 

const Chat = () =>{
    
}

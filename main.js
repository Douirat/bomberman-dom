import {Subscription} from "./frontend/subscription/Subscription.js"
import { FrameworkBuilder } from "./framework/FrameworkBuilder.js"
import { ChatRoom } from "./frontend/chat/ChatRoom.js"

const framework = new FrameworkBuilder()
                    .route("/", Subscription)
                    .route("/chat", ChatRoom)
                    .build()
framework.navigate("/chat")
framework.init()
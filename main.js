import {Subscription} from "./frontend/subscription/Subscription.js"
import { FrameworkBuilder } from "./framework/FrameworkBuilder.js"

const framework = new FrameworkBuilder()
                    .route("/", Subscription)
                    .build()

framework.init()
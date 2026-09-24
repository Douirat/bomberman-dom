import { VNodeBuilder } from "./framework/virtualization/VNodeBuilder.js";
import { VNode } from "./framework/virtualization/VNode.js";
import { FrameworkBuilder } from "./framework/FrameworkBuilder.js";
// import { Framework } from "./framework/Framework.js";

console.log("test  test  test");

const home = new VNodeBuilder()
    .type("div")
    .child(
        new VNode(
            "h1",
            false,
            {},
            {},
            [],
            "Home"
        )
    )
    .child(
        new VNode(
            "button",
            false,
            { id: "profile-button" },
            {
                click: () => {
                    history.pushState({}, "", "/profile");

                    // Tell your framework that the URL changed
                    framework.run();
                }
            },
            [],
            "Go to Profile"
        )
    )
    .build();

let profile = new VNodeBuilder()
    .type("div")
    .parent(true)
    .property("class", 'container')
    .child(
        new VNodeBuilder()
            .type("h1")
            .property("id", "text")
            .text("this is profile page")
            .build()
    )
    .child(
        new VNode(
            "button",
            false,
            { id: "home-button" },
            {
                click: () => {
                    history.pushState({}, "", "/");

                    // Tell your framework that the URL changed
                    framework.run();
                }
            },
            [],
            "Go to Home"
        )
    )
    .build();

let framework = new FrameworkBuilder()
    .route("/", home)
    .route("/profile", profile)
    .build();

framework.run()
import { Framework } from "./framework/Framework.js";
import { FrameworkBuilder } from "./framework/FrameworkBuilder.js";


const home = Framework.virtualize(
    "div",
    false,
    {},
    {},
    [
        Framework.virtualize(
            "h1",
            false,
            {},
            {},
            [],
            "Home"
        ),

        Framework.virtualize(
            "button",
            false,
            { id: "profile-button" },
            {
                click: () => {
                    history.pushState({}, "", "/profile");

                    let element = document.getElementById("profile-button");

                    framework.bridge(
                        "navigation",
                        element.parentElement
                    );

                    framework.run();
                }
            },
            [],
            "Go to Profile"
        )
    ]
);


const profile = Framework.virtualize(
    "div",
    true,
    { class: "container" },
    {},
    [
        Framework.virtualize(
            "h1",
            false,
            { id: "text" },
            {},
            [],
            "this is profile page"
        ),

        Framework.virtualize(
            "button",
            false,
            { id: "home-button" },
            {
                click: () => {
                    history.pushState({}, "", "/");
                    framework.run();
                }
            },
            [],
            "Go to Home"
        )
    ]
);


const posts = Framework.virtualize()


let framework = new FrameworkBuilder()
    .route("/", home)
    .route("/profile", profile)
    .build();


framework.run();
import { Framework } from "./framework/Framework.js";
import { FrameworkBuilder } from "./framework/FrameworkBuilder.js";
// import { VNodeBuilder } from "./framework/virtualization/VNodeBuilder.js";
import { TransactionType } from "./framework/TransactionType.js";


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
                     framework.navigate("/profile")
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
            { id: "profile" },
            {},
            [],
            "this is profile page"
        ),

        Framework.virtualize(
            "button",
            false,
            { id: "posts-button" },
            {
                click: () => {
                   framework.navigate("/posts")
                }
            },
            [],
            "Go to Home"
        )
    ]
);




// Created first, so the button handler can refer to them
const titleInput = Framework.virtualize(
    "input",
    false,
    { id: "post_title", type: "text", placeholder: "Title" }
);

const contentInput = Framework.virtualize(
    "textarea",
    false,
    { id: "post_content", placeholder: "Content", rows: "4" }
);

const postsList = Framework.virtualize(
    "div",
    false,
    { id: "posts_list" }
);

const addButton = Framework.virtualize(
    "button",
    false,
    { id: "add_post_button" },
    {
        click: () => {
            // Real input elements hold the typed values
            const titleElement = Framework.VNodeToHTML.get(titleInput);
            const contentElement = Framework.VNodeToHTML.get(contentInput);

            const title = titleElement.value.trim();
            const content = contentElement.value.trim();


            if (!title || !content) {
                return;
            }

            // New virtualization for the post
            const post = Framework.virtualize(
                "article",
                false,
                { class: "post" },
                {},
                [
                    Framework.virtualize("h3", false, {}, {}, [], title),
                    Framework.virtualize("p", false, {}, {}, [], content)
                ]
            );

            console.log("the newly created post: ", post);

            // Add it to the parent through the bridge
            framework.bridge(
                TransactionType.APPEND_CHILD,
                postsList,
                { child: post }
            );

            // Clear the form
            titleElement.value = "";
            contentElement.value = "";
        }
    },
    [],
    "Add post"
);

const posts = Framework.virtualize(
    "div",
    false,
    { id: "posts_container" },
    {},
    [
        Framework.virtualize("h1", false, {}, {}, [], "Posts"),
        titleInput,
        contentInput,
        addButton,
        postsList
    ]
);


let framework = new FrameworkBuilder()
    .route("/", home)
    .route("/profile", profile)
    .route("/posts", posts)
    .build();


framework.init();
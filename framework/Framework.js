import { VNode } from "./virtualization/VNode.js";
import { VNodeBuilder } from "./virtualization/VNodeBuilder.js";

export class Framework {
    #root;
    #routes;
    #currentPath;
    static HTMLToVNodes = new WeakMap();
    static VNodeToHTML = new WeakMap();
    // #components;
    constructor(root) {
        window.addEventListener("popstate", () => {
            this.render()
        })
        this.#root = document.getElementById(root);
        // this.#components = new Map();
        this.#routes = new Map();
        this.#routes["*"] = new VNodeBuilder()
            .tag("div")
            .child(new VNode("p", false, { id: "error_text" }, {}, [], "Page doesn't exist"))
            .build();
    }



    // For now i will run the framework and display objects based on the url.
    run() {
        this.#currentPath = window.location.pathname;
        let component = this.#routes[this.#currentPath];
        this.render(component)
    }



    render(element) {
        if (element instanceof VNode) {
            this.#root.innerHTML = "";

            this.#routes[this.#currentPath] = element;

            const htmlElement = element.toHTMLElement();

            this.#root.appendChild(htmlElement);

            console.log("VNode:", Framework.HTMLToVNodes);
            console.log("VNode: --->", Framework.VNodeToHTML);
        }
    }

    addRoute(path, node) {
        if (typeof path == "string" && node instanceof VNode) {
            this.#routes[path] = node;
        }
        return this;
    }

    /**
     * create the bridge between user actions and the framework:
     *
     */
    bridge(node, fn) {
        console.log("the node i want to map with", node);
        let vNode = Framework.HTMLToVNodes.get(node)
        let newNode = new VNodeBuilder()
            .tag("strong")
            .text("test the affect of the bridge")
            .build();
        vNode.appendChild(newNode);
        console.log(this.#currentPath);
        let origin = this.#routes[this.#currentPath];
        console.log("check the affect: ", origin);
    }

    static virtualize(
        tag,
        parent = false,
        properties = {},
        events = {},
        children = [],
        text = ""
    ) {
        let vNode = new VNodeBuilder();

        vNode.tag(tag)
        vNode.parent(parent)
        for (const [key, value] of Object.entries(properties)) {
            vNode.property(key, value)
        }
        for (const [key, value] of Object.entries(events)) {
            vNode.event(key, value)
        }

        // Text
        if (text) {
            vNode.text(text)
        }

        // Children
        for (child of children){
            if(child instanceof VNode){
                vNode.child(child)
            }
        }

        vNode = vNode.build()
        return vNode;
    }

}


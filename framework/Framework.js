import { VNode } from "./virtualization/VNode.js";
import { VNodeBuilder } from "./virtualization/VNodeBuilder.js";

export class Framework {
    #root;
    #routes;
    #currentPath;
    // #components;
    constructor(root) {
        window.addEventListener("popstate", () => {
            this.render()
        })
        this.#root = document.getElementById(root);
        // this.#components = new Map();
        this.#routes = new Map();
        this.#routes["*"] = new VNodeBuilder()
            .type("div")
            .child(new VNode("p", false, { id: "error_text" }, {}, [], "Page doesn't exist"))
            .build();
    }

    // For now i will run the framework and display objects based on the url.
    run() {
        this.#currentPath = window.location.pathname;
        console.log("path ---> "+ this.#currentPath);
        let component = this.#routes[this.#currentPath];
        this.render(component)
    }

    render(element) {
          console.log("rendering --->", element);
        if(element instanceof VNode){
            this.#root.innerHTML = "";
            element.key = `node-{this.#nextKey++}`;
            this.#routes[this.#currentPath] = element;
            this.#root.appendChild(element.toHTMLElement());
        }
    }

    addRoute(path, node){
        if( typeof path == "string" && node instanceof VNode){
            this.#routes[path] = node;
        }
        return this;
    }
}
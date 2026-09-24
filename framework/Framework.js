import { VNode } from "./virtualization/VNode.js";
import { Router } from "./router/Router.js";
import { VNodeBuilder } from "./virtualization/VNodeBuilder.js";

export class Framework {
    #root
    #router;
    #state;
    constructor(root) {
        window.addEventListener("popstate", () => {
            this.render()
        })
        this.#root = document.getElementById(root);
        this.#state = new Map();
        this.#router = new Router();
        this.#router["*"] = new VNodeBuilder()
            .type("div")
            .child(new VNode("p", false, { id: "error_text" }, {}, [], "Page doesn't exist"))
            .build();
    }

    // For now i will run the framework and display objects based on the url.
    run() {
        let path = window.location.pathname;
        console.log("path ---> "+ path);
        let component = this.#router.getComponent(path);
        this.render(component)
    }

    render(element) {
          console.log("rendering --->", element);
        if(element instanceof VNode){
            this.#root.innerHTML = "";
            this.#root.appendChild(element.toHTMLElement());
        }
    }

    addRoute(path, node){
        if( typeof path == "string" && node instanceof VNode){
            this.#router.addRoute(path, node);
        }
        return this;
    }

}
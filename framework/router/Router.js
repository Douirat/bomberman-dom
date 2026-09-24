import {VNode} from "../virtualization/VNode.js"

export class Router{
#routes
// #root
    constructor(){
        this.#routes={};
        // this.#root = document.getElementById("app");
    }

    // Create a method to append a new path with the object that should be rendered in that page.
    addRoute(path, vNode){
        if(typeof path == "string" && vNode instanceof VNode){
            this.#routes[path]=vNode;
        }
    }

    // Extract the component to render as html:
    getComponent(path){
        let component = this.#routes[path];
        if(component == null){
            return this.#routes["*"];
        }
        return component;
    }




}
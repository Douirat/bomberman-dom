import { VNode } from "./VNode.js";

export class VNodeBuilder{
    // The attribute that will hold the virtual node instance.
    #vNode;
    constructor () {
        this.#vNode = new VNode();
    }

    type(type){
        this.#vNode.type = type;
        return this;
    }

    parent(value){
        this.#vNode.parent = value;
        return this;
    }

    property(key, value){
        this.#vNode.addProperty(key, value);
        return this;
    }

    event(event, handler){
        if(typeof handler == "function"){
            this.#vNode.addEvent(event, handler);
        }
        return this;
    }

    child(child){
        if(child instanceof VNode){
            this.#vNode.appendChild(child)
        }
        return this
    }

    text(text){
        if(typeof text == "string"){
            this.#vNode.text = text;
        }
        return this;
    }

    build(){
        return this.#vNode;
    }
}
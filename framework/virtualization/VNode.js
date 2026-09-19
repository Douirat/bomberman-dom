export class VNode {
    nextVNodeId=0;
    #id
    #type;
    #properties;
    #events;
    #children;
    #text;

    constructor(
        type,
        properties = {},
        events = {},
        children = [],
        text = ""
    ) {
        this.#id=`VNode-${nextVNodeId++}`;
        this.#type = type;
        this.#properties = properties;
        this.#events = events;
        this.#children = children;
        this.#text = text;
    }

    // Getters
    get id(){
        return this.#id;
    }

    get type(){
        return this.#type;
    }

    get properties(){
        return this.#properties;
    }

    get events(){
        return this.#events;
    }

    get children(){
        return this.#children;
    }

    get text(){
        return this.#text;
    }



    // Setters
    set type(type){
        this.#type = type
    }

    appendChild(child){
        this.#children.push(child)
    }

    // Depletes

    removeChild(id){
        // the remove child implementation.
    }

}
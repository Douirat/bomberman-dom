export class VNode {
    static #nextKey = 1;
    #parent;
    #key;
    #type;
    #properties;
    #events;
    #children;
    #text;

    constructor(
        type,
        parent = false,
        properties = {},
        events = {},
        children = [],
        text = ""
    ) {
        this.#key = `node-${VNode.#nextKey++}`;
        this.#type = type;
        this.parent = parent;
        this.#properties = properties;
        this.#events = events;
        this.#children = children;
        this.#text = text;
    }

    // Getters
    get key() {
        return this.#key;
    }

    get type() {
        return this.#type;
    }

    get parent() {
        return this.#parent
    }

    get properties() {
        return this.#properties;
    }

    get events() {
        return this.#events;
    }

    get children() {
        return this.#children;
    }

    get text() {
        return this.#text;
    }



    // Setters
    set key(key){
        this.#key = key;
    }

    set type(type) {
        this.#type = type
    }

    set parent(value) {
        this.#parent = value;
    }

    addProperty(key, value) {
        this.#properties[key] = value;
    }

    addEvent(event, handler) {
        this.#events[event] = handler;
    }

    appendChild(child) {
        this.#children.push(child)
    }

    set text(text) {
        this.#text = text;
    }

    /*
    <<The rendering system is the core engine of every frontend
    framework it's what turns your data components into real
    visible, HTML on the screen. >>
--> What is the rendering system?
    <1> Converts the virtual {tag, attrs, children} UI description into actual DOM nodes.
    <2> updates the DOM when data changes or state changes.
    <3> Does it so efficiently {only changes what's necessary}.

    ==> Rendering is about creating the UI from data:
        let user = {"div", {class:"user"}, [{"h1", {class:"name"}, ["name"]}, {"h1", {class:"age"}, ["34"]}]}
        ==> you want to display:
        <div class="user">
            <h1>name</h1>
            <p>Age: 34</p>
        </div>

    ==> In vanilla js the developer will have to do all the DOM work himself:
        let el = document.createElement("div");
        But, framework's rendering system automates that for you,
        render(virtualDOMObject, parent)
*/
    toHTMLElement() {
        let element = document.createElement(this.#type);

        // Properties:
        for (const [name, value] of Object.entries(this.#properties)) {
            element.setAttribute(name, value);
        }

        // Events
        for (const [event, handler] of Object.entries(this.#events)) {
            element.addEventListener(event, handler);
        }

        // Text
        if (this.#text) {
            element.textContent = this.#text;
        }

        // Children
        for (const child of this.#children) {
            element.appendChild(child.toHTMLElement());
        }

        return element;
    }
    /*
    * This mirrors the idea behind frameworks like React or Vue: separating the “description”
    * of the UI from the actual DOM, allowing us to reason about UI in pure JavaScript objects
    * rather than manipulating the DOM directly.
    */
}
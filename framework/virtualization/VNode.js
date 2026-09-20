export class VNode {
    nextVNodeId = 0;
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
        this.#id = `VNode-${nextVNodeId++}`;
        this.#type = type;
        this.#properties = properties;
        this.#events = events;
        this.#children = children;
        this.#text = text;
    }

    // Getters
    get id() {
        return this.#id;
    }

    get type() {
        return this.#type;
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
    set type(type) {
        this.#type = type
    }

    appendChild(child) {
        this.#children.push(child)
    }

    // Depletes

    removeChild(id) {
        // the remove child implementation.
    }


    /*
    <<The rendering system is the core engine of every frontend
    framework it's what turns your data components into real
    visible, HTML on the screen. >>
--> What is the rendering system?
    <1> Converts the virtulal {tag, attrs, children} UI description into actual DOM nodes.
    <2> updates the DOM when data changes or state changes.
    <3> Does it so efficiently {only changes what's necessary}.

    ==> Rendering is about creating the UI from data:
        let user = {"div", {class:"user"}, [{"h1", {class:"name"}, ["bennacer"]}, {"h1", {class:"age"}, ["34"]}]}
        ==> you want to display:
        <div clas="user">
            <h1>Bennacer</h1>
            <p>Age: 24</p>
        </div>

    ==> In vanilla js the developer will have to do all the DOM work himself:
        let el = document.createElement("div");
        But, framework's rendering system automates that for you,
        render(vertualDOMObject, parent)
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
            this.element.textContent(this.#text);
        }

        // Children
        for (const child of this.#children) {
            element.appendChild(child.toHTMLElement());
        }

        return element;
    }
    /*This mirrors the idea behind frameworks like React or Vue: separating the “description”
    of the UI from the actual DOM, allowing us to reason about UI in pure JavaScript objects
    rather than manipulating the DOM directly. */

}
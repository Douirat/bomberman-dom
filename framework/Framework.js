import { VNode } from "./virtualization/VNode.js";
import { VNodeBuilder } from "./virtualization/VNodeBuilder.js";
import { TransactionType } from "./TransactionType.js";

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
        this.bridge("CREATE", component)
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
 * Single entry point for every change that affects a VNode.
 *
 * Application code never mutates a VNode directly. It describes the change
 * with a TransactionType, and the bridge validates it, applies it to the
 * VNode, records it, and schedules the reconciliation with the DOM.
 *
 * Flow:
 *   1. Validate the target VNode and the payload.
 *   2. Capture the previous value (needed by the reconciler and for undo).
 *   3. Mutate the VNode through its own methods, which keep the parent
 *      pointers in sync.
 *   4. Record { type, key, payload, previous } in the pending queue.
 *   5. Flush the queue in one batch and reconcile using Framework.VNodeToHTML.
 *
 * Logic events (fetch, websocket) must not call this method. They update
 * state, and the re-render produces the transactions.
 *
 * @param {string} transactionType - A value from TransactionType.
 *        Never a raw string.
 * @param {VNode} vNode - The VNode the change applies to. For child
 *        operations this is the parent. To start from a DOM element, resolve
 *        it first with Framework.HTMLToVNodes.get(element).
 * @param {Object} [payload={}] - Data for the transaction. The shape
 *        depends on the type:
 *
 *   Lifecycle
 *     MOUNT_VNODE      { child, index? }
 *     UNMOUNT_VNODE    {}
 *     REPLACE_VNODE    { newNode }
 *
 *   Identity
 *     UPDATE_KEY       { key }
 *     UPDATE_TAG       { tag }
 *
 *   Tree structure
 *     UPDATE_PARENT    { parent }
 *     APPEND_CHILD     { child }
 *     INSERT_CHILD_AT  { child, index }
 *     REMOVE_CHILD     { child }
 *     REPLACE_CHILD    { oldChild, newChild }
 *     MOVE_CHILD       { child, toIndex }
 *     CLEAR_CHILDREN   {}
 *     SET_CHILDREN     { children }
 *
 *   Properties
 *     ADD_PROPERTY     { name, value }
 *     UPDATE_PROPERTY  { name, value }
 *     REMOVE_PROPERTY  { name }
 *     SET_PROPERTIES   { properties }
 *     CLEAR_PROPERTIES {}
 *
 *   Events
 *     ADD_EVENT        { event, handler }
 *     UPDATE_EVENT     { event, handler }
 *     REMOVE_EVENT     { event }
 *     SET_EVENTS       { events }
 *     CLEAR_EVENTS     {}
 *
 *   Text
 *     SET_TEXT         { text }
 *     UPDATE_TEXT      { text }
 *     REMOVE_TEXT      {}
 *
 * @throws {Error} If the transaction type is unknown, a required payload
 *         field is missing, an index is out of range, or the change would
 *         create a cycle in the tree.
 *
 * @example
 * // Change a label
 * framework.bridge(TransactionType.UPDATE_TEXT, labelNode, { text: "3 items left" });
 *
 * @example
 * // Add a child to a list
 * framework.bridge(TransactionType.APPEND_CHILD, listNode, { child: itemNode });
 *
 * @example
 * // From a DOM event: resolve the VNode first
 * const vNode = Framework.HTMLToVNodes.get(event.currentTarget);
 * framework.bridge(TransactionType.UPDATE_PROPERTY, vNode, { name: "class", value: "completed" });
 */
bridge(transactionType, vNode, payload = {}) {

    const vNode = Framework.HTMLToVNodes.get(node);

    if (!vNode) {
        return;
    }

    switch (transactionType) {

        case TransactionType.CREATE:
            // ...
            break;

        case TransactionType.APPEND_CHILD:
            vNode.appendChild(value);
            break;

        case TransactionType.REMOVE_CHILD:
            vNode.removeChild(value);
            break;

        case TransactionType.UPDATE_TAG:
            vNode.tag = value;
            break;

        case TransactionType.SET_PROPERTY:
            vNode.properties[key] = value;
            break;

        case TransactionType.REMOVE_PROPERTY:
            // ...
            break;

        case TransactionType.SET_EVENT:
            // ...
            break;

        case TransactionType.REMOVE_EVENT:
            // ...
            break;

        case TransactionType.UPDATE_TEXT:
            vNode.text = value;
            break;
    }

    // old tree vs new tree
    // diff
    // reconcile
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
        for (const child of children) {
            if (child instanceof VNode) {
                vNode.child(child)
            }
        }

        vNode = vNode.build()
        return vNode;
    }

}


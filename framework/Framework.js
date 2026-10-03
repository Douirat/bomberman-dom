import { VNode } from "./virtualization/VNode.js";
import { VNodeBuilder } from "./virtualization/VNodeBuilder.js";
import { TransactionType } from "./TransactionType.js";

export class Framework {
    #root;
    #originals;
    #routes;
    #currentPath;
    #notFound = "*"
    static HTMLToVNodes = new WeakMap();
    static VNodeToHTML = new WeakMap();


    constructor(root) {
        this.#root = document.getElementById(root);
        this.#originals = new Map();
        this.#routes = new Map();

        this.#currentPath = window.location.pathname;

        window.addEventListener("popstate", () => {
            console.log("triggered...");

            this.#currentPath = window.location.pathname;

            let exist = this.#routes.get(this.#currentPath) == undefined ? false : true;

            if (!exist) {
                this.#currentPath = "*"
            }

            this.render();
        });

        this.#routes.set("*", new VNodeBuilder()
            .tag("div")
            .child(
                new VNode(
                    "p",
                    false,
                    { id: "node_found" },
                    {},
                    [],
                    "404 page not found!"
                )
            )
            .build()
        )
    }



    // For now i will run the framework and display objects based on the url.
    init() {
        let component = this.#routes.get(this.#currentPath);
        if (!component) {
            component = this.#routes.get(this.#notFound);
        }
        this.bridge("mount_vnode", component)
    }


    render() {
        console.log("the path has changed ", this.#currentPath);
        let element = this.#routes.get(this.#currentPath);
        if (!element) {
            element = this.#routes.get(this.#notFound);
        }
        if (element instanceof VNode) {
            this.#root.innerHTML = "";
            console.log(this.#currentPath);
            this.#routes.set(this.#currentPath, element);

            const htmlElement = element.toHTMLElement();

            this.#root.appendChild(htmlElement);
        }
    }

    addRoute(path, node) {
        if (typeof path == "string" && node instanceof VNode) {
            this.#originals.set(path, node.clone());
            this.#routes.set(path, node);
        }
        return this;
    }

    navigate(path = "*") {
        history.pushState({}, "", path);
        this.#currentPath = window.location.pathname;
        this.render();
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
    bridge(transactionType, parent, payload = {}) {

        if (!parent) return;

        // let node = Framework.HTMLToVNodes.get(parent)



        switch (transactionType) {

            // ── Lifecycle ──
            case TransactionType.MOUNT_VNODE:
                this.render(parent)
                break;

            case TransactionType.UNMOUNT_VNODE:
                node = null;
                break;

            case TransactionType.REPLACE_VNODE:
                node = payload.node;
                break;

            // ── Identity ──
            case TransactionType.UPDATE_KEY:

                break;

            case TransactionType.UPDATE_TAG:

                break;

            // ── Tree structure ──
            case TransactionType.UPDATE_PARENT:

                break;

            case TransactionType.APPEND_CHILD:
                console.log("before addition: ", payload);
                if (parent instanceof VNode) {
                    parent.appendChild(payload.child);
                    let patches = this.diff(this.#originals.get(this.#currentPath), this.#routes.get(this.#currentPath));
                    console.log("the patches: ", patches);
                    this.reconcile(patches, Framework.VNodeToHTML.get(this.#routes.get(this.#currentPath)));
                }
                console.log("check the change in the oriinals -----> ", this.#originals.get(this.#currentPath).children);
                console.log("check the change -----> ", this.#routes.get(this.#currentPath).children);

                break;

            case TransactionType.INSERT_CHILD_AT:

                break;

            case TransactionType.REMOVE_CHILD:

                break;

            case TransactionType.REPLACE_CHILD:

                break;

            case TransactionType.MOVE_CHILD:

                break;

            case TransactionType.CLEAR_CHILDREN:

                break;

            case TransactionType.SET_CHILDREN:

                break;

            // ── Properties ──
            case TransactionType.ADD_PROPERTY:

                break;

            case TransactionType.UPDATE_PROPERTY:

                break;

            case TransactionType.REMOVE_PROPERTY:

                break;

            case TransactionType.SET_PROPERTIES:

                break;

            case TransactionType.CLEAR_PROPERTIES:

                break;

            // ── Events ──
            case TransactionType.ADD_EVENT:

                break;

            case TransactionType.UPDATE_EVENT:

                break;

            case TransactionType.REMOVE_EVENT:

                break;

            case TransactionType.SET_EVENTS:

                break;

            case TransactionType.CLEAR_EVENTS:

                break;

            // ── Text ──
            case TransactionType.SET_TEXT:

                break;

            case TransactionType.UPDATE_TEXT:

                break;

            case TransactionType.REMOVE_TEXT:

                break;

            default:
                throw new Error(`Unknown transaction type: ${transactionType}`);
        }
    }


    /**
 * =============== Diffing Algorithm Summary ===============
 * 1. Compare the tags of the old and new nodes.
 * 2. If the tags are different, replace the old node with the new node.
 * 3. If the tags are the same, compare their attributes.
 * 4. If any attribute differs, update only the changed attributes on the real DOM.
 * 5. Compare the children of both nodes recursively.
 * 6. If any child differs, update only that child on the real DOM.
 * 7. If there are no differences, do nothing.
 *no params cause the old vnode and the now vnode live in the maps originals and routes but that will creat a problem cause recursion is required.
 * @param {object} oldNode - The old virtual DOM node.
 * @param {object} newNode - The new virtual DOM node.
 * @returns {object} - An object of patches describing the diffrence between the ols and the new vnode and the new Vnode { change: "create", node: newNode } or { change: "remove" } or { change: "replace", node: newNode } or { change: "text", text: newNode } or { change: "attributes", node: newNode } or { change: "update", childs: patches }
 */

    diff(oldNode, newNode) {
        if (!oldNode) return { change: "create", node: newNode }
        if (!newNode) return { change: "remove" }
        if (oldNode?.tag != newNode?.tag) return { change: "replace", node: newNode }
        if (!oldNode.tag && !newNode.tag && oldNode !== newNode) return { change: 'text', text: newNode };

        if (oldNode.attrs && newNode.attrs) {
            for (let key in newNode.attrs) {
                if (newNode.attrs[key] !== oldNode.attrs[key]) {
                    return { change: "attributes", node: newNode }
                }
            }
        }

        const patches = []
        const childLength = Math.max(oldNode.children.length, newNode.children.length);
        for (let i = 0; i < childLength; i++) {
            patches.push(this.diff(oldNode?.children[i], newNode?.children[i]))
        }
        if (patches.length > 0) {
            return { change: "update", childs: patches }
        }
    }


    /**
     *  Reconciles the differences between the old and new virtual DOM nodes and updates the real DOM accordingly.
     *  It takes the patches generated by the diffing algorithm and applies them to the real DOM.
     *  This method ensures that only the necessary changes are made to the DOM, improving performance and efficiency.
     * @param {object} patches - The object of patches describing the differences between the old and new virtual DOM nodes.
     * @param {HTMLElement} parentElement - The parent HTML element where the changes will be applied.
     */
    reconcile(patches, parentElement) {
        if (!patches) return;
        switch (patches.change) {
            case "replace":
                const newNode = patches.node.toHTMLElement();
                parentElement.parentNode.replaceChild(newNode, parentElement);
                break;
            case "remove":
                document.body.removeChild(parentElement);
                break;
            case "text":
                parentElement.textContent = patches.text;
                break;
            case "attributes":
                parentElement.parentNode.replaceChild(patches.node.toHTMLElement(), parentElement)
                break;
            case "update":
                for (let childPatch of patches.childs) {
                    const childElement = parentElement.childNodes[patches.childs.indexOf(childPatch)];
                    if (childElement) {
                        this.reconcile(childPatch, childElement);
                    } else {
                        parentElement.appendChild(childPatch.node.toHTMLElement());
                    }
                    break;
                }
        }
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


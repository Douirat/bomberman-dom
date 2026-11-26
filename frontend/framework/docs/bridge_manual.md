# Using the Bridge

The bridge is the single entry point for every change that affects a VNode. Nothing mutates a VNode directly from outside the framework: you describe what you want with a `TransactionType`, pass the target VNode and a payload, and the bridge takes care of the mutation, recording and reconciliation with the DOM.

## Signature

```javascript
framework.bridge(transactionType, vNode, payload = {})
```

| Argument | Meaning |
|---|---|
| `transactionType` | A value from `TransactionType`. Never a raw string. |
| `vNode` | The VNode the change applies to (the parent, when the change concerns its children). |
| `payload` | An object whose shape depends on the transaction type (see the reference below). |

An unknown type throws. A wrong payload shape throws or warns, depending on the validation you implement.

## Two channels

Keep the two kinds of events separate:

1. **View events** (click, input, route change): they call `bridge` with a transaction.
2. **Logic events** (fetch, websocket): they update state. The state change triggers a re-render, and the re-render calls `bridge`. They never call `bridge` themselves.

```
user action  ──▶ handler ──▶ bridge(transaction) ──▶ VNode mutated ──▶ queue ──▶ reconcile ──▶ DOM
fetch / ws   ──▶ state update ──▶ re-render ─────────▶ bridge(transaction) ─┘
```

## Getting the VNode

`bridge` receives a VNode, not an HTML element. If you only have the element (for example inside a DOM event), resolve it first:

```javascript
const vNode = Framework.HTMLToVNodes.get(event.currentTarget);
framework.bridge(TransactionType.UPDATE_TEXT, vNode, { text: "Done" });
```

If the lookup returns `undefined`, the element is not managed by the framework. Do not call `bridge`.

## Payload reference

### Lifecycle

| Type | Target | Payload |
|---|---|---|
| `MOUNT_VNODE` | parent | `{ child, index? }` |
| `UNMOUNT_VNODE` | the node | `{}` |
| `REPLACE_VNODE` | the node | `{ newNode }` |

### Identity

| Type | Target | Payload |
|---|---|---|
| `UPDATE_KEY` | the node | `{ key }` |
| `UPDATE_TAG` | the node | `{ tag }` |

### Tree structure

| Type | Target | Payload |
|---|---|---|
| `UPDATE_PARENT` | the node | `{ parent }` |
| `APPEND_CHILD` | parent | `{ child }` |
| `INSERT_CHILD_AT` | parent | `{ child, index }` |
| `REMOVE_CHILD` | parent | `{ child }` |
| `REPLACE_CHILD` | parent | `{ oldChild, newChild }` |
| `MOVE_CHILD` | parent | `{ child, toIndex }` |
| `CLEAR_CHILDREN` | parent | `{}` |
| `SET_CHILDREN` | parent | `{ children }` |

### Properties

| Type | Target | Payload |
|---|---|---|
| `ADD_PROPERTY` | the node | `{ name, value }` |
| `UPDATE_PROPERTY` | the node | `{ name, value }` |
| `REMOVE_PROPERTY` | the node | `{ name }` |
| `SET_PROPERTIES` | the node | `{ properties }` |
| `CLEAR_PROPERTIES` | the node | `{}` |

### Events

| Type | Target | Payload |
|---|---|---|
| `ADD_EVENT` | the node | `{ event, handler }` |
| `UPDATE_EVENT` | the node | `{ event, handler }` |
| `REMOVE_EVENT` | the node | `{ event }` |
| `SET_EVENTS` | the node | `{ events }` |
| `CLEAR_EVENTS` | the node | `{}` |

### Text

| Type | Target | Payload |
|---|---|---|
| `SET_TEXT` | the node | `{ text }` |
| `UPDATE_TEXT` | the node | `{ text }` |
| `REMOVE_TEXT` | the node | `{}` |

## Examples

**Change a label**

```javascript
framework.bridge(TransactionType.UPDATE_TEXT, labelNode, { text: "3 items left" });
```

**Add a todo to a list**

```javascript
const item = Framework.virtualize("li", false, { class: "todo" }, {}, [], "Buy milk");
framework.bridge(TransactionType.APPEND_CHILD, listNode, { child: item });
```

**Toggle a CSS class**

```javascript
framework.bridge(TransactionType.UPDATE_PROPERTY, itemNode, { name: "class", value: "todo completed" });
```

**Attach a click handler**

```javascript
framework.bridge(TransactionType.ADD_EVENT, buttonNode, {
    event: "click",
    handler: () => deleteTodo(id)
});
```

**Replace a handler** (the old one is removed from the DOM for you)

```javascript
framework.bridge(TransactionType.UPDATE_EVENT, buttonNode, { event: "click", handler: newHandler });
```

**Reorder a list item**

```javascript
framework.bridge(TransactionType.MOVE_CHILD, listNode, { child: itemNode, toIndex: 0 });
```

**Change the tag** (the DOM element is replaced, children and listeners are carried over)

```javascript
framework.bridge(TransactionType.UPDATE_TAG, headingNode, { tag: "h2" });
```

## Choosing the right type

- **Add, update, remove are different types.** Use `ADD_*` only when the entry does not exist, `UPDATE_*` only when it does, `REMOVE_*` to delete it. Use `SET_*` when you are replacing the whole collection.
- **Prefer the smallest transaction.** To change one attribute, use `UPDATE_PROPERTY`, not `SET_PROPERTIES`. Small transactions make reconciliation cheaper.
- **Prefer `MOVE_CHILD` over remove plus append** when reordering. Moving reuses the existing DOM element and keeps its state.
- **Do not use `UPDATE_PARENT` on its own.** The child operations already keep the parent pointer in sync. Use it only when you know the children arrays are handled separately.

## What the bridge does for you

1. Validates the target and the payload.
2. Captures the previous value before mutating.
3. Mutates the VNode through its own methods.
4. Records `{ type, key, payload, previous }` in the pending queue.
5. Flushes the queue in one batch, then reconciles with the DOM using the `VNodeToHTML` map.

Several transactions on the same node in the same tick are merged when possible. For example, an append followed by a remove of the same child cancels out.

## Rules

- Always use `TransactionType.X`. A raw string like `"CREATE"` will throw.
- Never call VNode setters or `appendChild` directly from application code. Go through the bridge, or the DOM will not be updated.
- Never call `bridge` from a fetch or websocket callback. Update state and let the render produce the transactions.
- Never call `bridge` with a DOM element. Resolve the VNode first.
- A no-op change (same tag, same text, same value) is ignored and produces no transaction.

## Errors

| Situation | Result |
|---|---|
| Unknown transaction type | Throws |
| Payload missing a required field | Throws |
| `ADD_*` on an entry that already exists | Warns and ignores |
| `UPDATE_*` or `REMOVE_*` on a missing entry | Warns and ignores |
| Index out of range | Throws |
| Moving a node under its own descendant | Throws |
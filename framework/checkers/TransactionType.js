export const TransactionType = Object.freeze({

    // ── Lifecycle ──────────────────────────────
    MOUNT_VNODE:            "mount_vnode",            // VNode created and attached to the tree
    UNMOUNT_VNODE:          "unmount_vnode",          // VNode removed from the tree and cleaned up
    REPLACE_VNODE:          "replace_vnode",          // whole node swapped for another one

    // ── Identity ───────────────────────────────
    UPDATE_KEY:             "update_key",             // key changed
    UPDATE_TAG:             "update_tag",             // tag changed (DOM: replace the element)

    // ── Tree structure ─────────────────────────
    UPDATE_PARENT:          "update_parent",          // parent reference changed
    APPEND_CHILD:           "append_child",           // child added at the end
    INSERT_CHILD_AT:        "insert_child_at",        // child added at an index
    REMOVE_CHILD:           "remove_child",           // child removed
    REPLACE_CHILD:          "replace_child",          // one child swapped for another
    MOVE_CHILD:             "move_child",             // child reordered within the same parent
    CLEAR_CHILDREN:         "clear_children",         // all children removed
    SET_CHILDREN:           "set_children",           // whole children array replaced

    // ── Properties (attributes) ────────────────
    ADD_PROPERTY:           "add_property",           // new attribute
    UPDATE_PROPERTY:        "update_property",        // existing attribute changed
    REMOVE_PROPERTY:        "remove_property",        // attribute removed
    SET_PROPERTIES:         "set_properties",         // whole properties object replaced
    CLEAR_PROPERTIES:       "clear_properties",       // all attributes removed

    // ── Events ─────────────────────────────────
    ADD_EVENT:              "add_event",              // new listener
    UPDATE_EVENT:           "update_event",           // handler swapped for the same event
    REMOVE_EVENT:           "remove_event",           // listener removed
    SET_EVENTS:             "set_events",             // whole events object replaced
    CLEAR_EVENTS:           "clear_events",           // all listeners removed

    // ── Text ───────────────────────────────────
    SET_TEXT:               "set_text",               // text set on a node that had none
    UPDATE_TEXT:            "update_text",            // text changed
    REMOVE_TEXT:            "remove_text"             // text cleared
});
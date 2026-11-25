import { Framework } from "../../framework/Framework.js"

/**
 * virtualize the subscription form.
 */
export const Subscription = Framework.virtualize(
    "form",
    false,
    {"id": "subscription-form"},
    {"submit": ()=>{
        console.log("the logic of submiting the subscription form will be implemented here.")
    }},
    [Framework.virtualize("input", false, {"type": "email", "placeholder": "Enter your email", "name": "email", "required": true}), 
    Framework.virtualize("button", false, {"type": "submit"}, {}, [], "Subscribe")
],

)
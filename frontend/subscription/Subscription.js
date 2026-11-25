import { Framework } from "../../framework/Framework.js"

/**
 * virtualize the subscription form.
 */
export const Subscription = Framework.virtualize(
    "form",
    false,
    {"id": "subscription-form"},
    {"submit": (e)=>{
        e.preventDefault()
        const form = document.getElementById("subscription-form")
        const usernameInput = form.querySelector("input[name='username']").value.trim()
       
        console.log(`Username submitted: ${usernameInput}`)
    }},
    [Framework.virtualize("input", false, {"type": "text", "placeholder": "Enter your username", "name": "username", "required": true}), 
    Framework.virtualize("button", false, {"type": "submit"}, {}, [], "Subscribe")
],

)
import { GameObject } from './src/modules/main';
import { allEvents } from "./src/modules/ui.js"
window.addEventListener("load", function () {
    GameObject.render()

    allEvents.init()
})

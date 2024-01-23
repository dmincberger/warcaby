import { GameObject, } from './src/modules/main';
import { allEvents } from "./src/modules/ui.js"
import { plansza } from "./src/modules/plansza"

window.addEventListener("load", function () {

    plansza.generacja_plnaszy()
    GameObject.render()
    allEvents.init()

    let logowanie = document.getElementById("logowanie")
    logowanie.showModal()


})

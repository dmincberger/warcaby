import { GameObject, } from './modules/main';
import { allEvents } from "./modules/ui.js"
import { plansza } from "./modules/plansza"

window.addEventListener("load", function () {

    plansza.generacja_planszy()
    GameObject.render()
    allEvents.init()

    let logowanie = document.getElementById("logowanie")
    logowanie.showModal()



})

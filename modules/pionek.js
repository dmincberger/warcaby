import { CylinderGeometry, Mesh, MeshBasicMaterial } from "three"
import { plansza } from "./plansza.js"
import { scene, szachownica } from './main'
export default class Pionek {
    constructor(scene) {
        this.scene = scene
        this.geometry = new CylinderGeometry(1, 1, 1)
        this.material = new MeshBasicMaterial({ color: 0x0fa546 })
        const pion = new Mesh(this.geometry, this.material)
        return pion
    }
    ustaw_kolor(kolor) {
        this.material.color.setHex(kolor)
    }

}
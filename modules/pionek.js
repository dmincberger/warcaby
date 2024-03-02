import { CylinderGeometry, Mesh, MeshBasicMaterial, TextureLoader } from "three"
import { plansza } from "./plansza.js"
import { scene, szachownica } from './main'

export default class Pionek {
    constructor(scene) {
        this.scene = scene
        this.geometry = new CylinderGeometry(0.2, 0.2, 0.2)
        this.material = new MeshBasicMaterial()
        const pion = new Mesh(this.geometry, this.material)
        console.log(pion.type);
        return pion
    }

}
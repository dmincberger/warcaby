import { PlaneGeometry, AxesHelper, Mesh, MeshBasicMaterial, DoubleSide, BoxGeometry } from 'three'
import { scene } from './main'
let plansza = {
    generacja_plnaszy() {
        let linie = new AxesHelper(100)
        let pola = []
        pola.push(new MeshBasicMaterial({ color: 0xffffff, side: DoubleSide, wireframe: true }));
        pola.push(new MeshBasicMaterial({ color: 0x000000, side: DoubleSide }));
        let ksztalt = new BoxGeometry(1, 0.2)
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let kostka = new Mesh(ksztalt, pola[j % 2])
                kostka.position.set(j, 1, i)
                scene.add(kostka)
            }
        }
        scene.add(linie)
    }
}

export { plansza }
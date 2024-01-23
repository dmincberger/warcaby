import { PlaneGeometry, AxesHelper, Mesh, MeshBasicMaterial, DoubleSide, BoxGeometry, TextureLoader } from 'three'
import { scene, szachownica } from './main'
let plansza = {
    generacja_plnaszy() {
        let linie = new AxesHelper(100)
        let pola = []
        pola.push(new MeshBasicMaterial({ side: DoubleSide, map: new TextureLoader().load('./static/images/czarny.jpg') }));
        pola.push(new MeshBasicMaterial({ side: DoubleSide, map: new TextureLoader().load('./static/images/bialy.jpg') }));
        let ksztalt = new BoxGeometry(1, 0.2)
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let typ_materialu = szachownica[i][j]
                let kostka = new Mesh(ksztalt, pola[typ_materialu])
                kostka.position.set(j, 1, i)
                scene.add(kostka)
            }
        }
        scene.add(linie)
    }
}

export { plansza }
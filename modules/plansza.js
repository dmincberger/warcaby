import { PlaneGeometry, AxesHelper, Mesh, MeshBasicMaterial, DoubleSide, BoxGeometry, TextureLoader } from 'three'
import { scene, szachownica, pionki } from './main'
import Pionek from './pionek'
let plansza = {
    generacja_planszy() {
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
    },
    generacja_pionkow() {
        let count_r = 0
        let count_col = 0
        pionki.forEach((row) => {
            count_col = 0
            row.forEach((col) => {
                if (col != 0) {
                    let warcab = new Pionek(scene)
                    console.log("test ile " + col);
                    if (col == 1) {
                        warcab.material.color.set(0, 0, 0)
                    }
                    if (col == 2) {
                        warcab.material.color.set(255, 255, 255)
                    }
                    warcab.position.set(count_r, 1.2, count_col)
                    scene.add(warcab)
                }
                count_col += 1
            })
            count_r += 1
        })
        console.log(scene);
    }
}

export { plansza }
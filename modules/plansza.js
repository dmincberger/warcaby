import { PlaneGeometry, AxesHelper, Mesh, MeshBasicMaterial, DoubleSide, BoxGeometry, TextureLoader } from 'three'
import { scene, szachownica, pionki } from './main'
import Pionek from './pionek'

let bialy = new TextureLoader().load('./static/images/bialy.jpg')
let czarny = new TextureLoader().load('./static/images/czarny.jpg')
let czarny_pion = new TextureLoader().load('./static/images/czarny_pion.jpg')
let bialy_pion = new TextureLoader().load('./static/images/bialy_pion.jpg')
let material
let plansza = {
    generacja_planszy() {
        let ksztalt = new BoxGeometry(1, 0.2)
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let typ_materialu = szachownica[i][j]
                if (typ_materialu == 1) {
                    material = new MeshBasicMaterial({ side: DoubleSide, map: bialy })
                }
                if (typ_materialu == 0) {
                    material = new MeshBasicMaterial({ side: DoubleSide, map: czarny })
                }
                let kostka = new Mesh(ksztalt, material)
                kostka.position.set(j, 1, i)
                kostka.userData.identyfikator = "p:" + j + ":" + i
                scene.add(kostka)
            }
        }
    },
    generacja_pionkow(odpowiedz) {
        let count_r = 0
        let count_col = 0
        pionki.forEach((row) => {
            count_col = 0
            row.forEach((col) => {

                if (col != 0) {
                    let warcab = new Pionek(scene)
                    if (col == 1) {

                        warcab.material.map = czarny_pion
                        warcab.userData.kolor = "czarny"
                        console.log(warcab.material.map.image.src);

                    }
                    if (col == 2) {

                        warcab.material.map = bialy_pion
                        warcab.userData.kolor = "bialy"
                        console.log(warcab.material.map.image.src);
                        console.log(warcab.material.map.image.src + ": IMAGE");
                    }
                    warcab.position.set(count_r, 1.2, count_col)


                    warcab.userData.identyfikator = "w:" + count_r + ":" + count_col
                    warcab.userData.pozycja = "w:" + count_r + ":" + count_col
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
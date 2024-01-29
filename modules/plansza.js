import { PlaneGeometry, AxesHelper, Mesh, MeshBasicMaterial, DoubleSide, BoxGeometry, TextureLoader } from 'three'
import { scene, szachownica, pionki } from './main'
import Pionek from './pionek'
console.log(Pionek);
let warcab = new Pionek(scene)

warcab.ustaw_kolor(0x000000)
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
        let kolory = [0x000000, 0xffffff]
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let kolor = kolory[pionki[i][j] - 1]
                let warcab = new Pionek(scene)
                console.log("test ile");
                warcab.ustaw_kolor(kolor)
                warcab.position.set(j, 1.2, i)
                scene.add(warcab)
            }
        }
    }
}

export { plansza }
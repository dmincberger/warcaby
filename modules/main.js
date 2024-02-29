import { Scene, Clock, Raycaster, Vector2, ArrowHelper } from 'three';
import Renderer from './renderer';
import Camera from './camera';
let highlightedPawn = null;

let kolor
let podswietlane = []
const container = document.getElementById('root')
const scene = new Scene()
const renderer = new Renderer(scene, container)
const camera = new Camera(renderer.threeRenderer)
const raycaster = new Raycaster();
const mouseVector = new Vector2()
let Start_gry = false
const szachownica = [
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
]

const pionki = [
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 0, 2, 0, 2, 0, 2],
    [2, 0, 2, 0, 2, 0, 2, 0]
]

const GameObject = {

    ustawienie_koloru(odpowiedz) {
        kolor = odpowiedz
    },

    render() {

        console.log("render")
        renderer.render(scene, camera.threeCamera);

        requestAnimationFrame(GameObject.render);

    },
    Start_ruszania() {
        window.addEventListener("mousedown", (e) => {
            let kolor_piona
            mouseVector.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouseVector.y = -(e.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouseVector, camera.threeCamera)

            const intersects = raycaster.intersectObjects(scene.children);
            if (intersects.length > 0) {
                console.log("TEST POZYCJI!: " + intersects[0].object.position.z);
                if (intersects[0].object.material.color.r === 0) {
                    kolor_piona = "czarny"
                }
                if (intersects[0].object.material.color.r === 255) {
                    kolor_piona = "bialy"
                }
                let pion = intersects[0].object
                console.log("TO JEST PION: " + intersects[0].object.material);
                // console.log("TO JEST PION: " + Object.keys(pion.userData));
                GameObject.Podswietlenie_piona(kolor_piona, pion)
                GameObject.Mozliweruchy(pion.userData.identyfikator, kolor_piona)
                if (highlightedPawn && intersects[0].object.userData.identyfikator.split(":")[0] == "p") {
                    console.log("a testuje sobie ruchy: " + typeof highlightedPawn);
                    GameObject.Ruch(highlightedPawn)
                }
            }

        });
    },

    Podswietlenie_piona(kolor_piona, pion) {
        if (highlightedPawn) {
            if (kolor == "bialy") {
                scene.children.forEach((element) => {
                    if (element.userData.identyfikator == highlightedPawn.userData.identyfikator) {
                        element.material.color.set(255, 255, 255)
                        console.log("ELEMENT COLOR:" + element.material.color.r);
                    }
                })
            }
            if (kolor == "czarny") {
                scene.children.forEach((element) => {
                    if (element.userData.identyfikator == highlightedPawn.userData.identyfikator) {
                        element.material.color.set(0, 0, 0)
                    }
                })
            }
            highlightedPawn = null
        }
        console.log("kolor piona: " + pion.material.color.r);
        if (kolor == kolor_piona) {
            scene.children.forEach((element) => {
                if (element.userData.identyfikator == pion.userData.identyfikator) {
                    highlightedPawn = element
                    element.material.color.setRGB(0.55, 0.55, 0.55)
                }
            })
        }
    },

    Mozliweruchy(pozycja, kolor_pion) {
        if (podswietlane.length != 0) {
            podswietlane.forEach((element) => {
                scene.children.forEach((pole) => {
                    if (pole.userData.identyfikator == element) {
                        pole.material.color.setRGB(1, 1, 1)
                    }
                })
            })
        }
        console.log(scene.children.length);
        let dodaj = true
        let pozycje = pozycja.split(":")
        let row = parseInt(pozycje[1])
        let col = parseInt(pozycje[2])
        console.log(row);
        console.log(col);
        let dlugosc = scene.children.length
        //CZARNI:
        //row idą row + 1, więc sprawdzić czy row nie jest równy 0
        //col idą w prawo + 1 w lewo - 1, więc sprawdzić czy jest równy 0 lub 7
        if (kolor_pion == "czarny" && kolor == "czarny") {
            if (row != 7) {
                if (col != 7) {
                    let pokoloruj = null

                    let ruch_row = row + 1
                    let ruch_col = col + 1
                    let kordy = "p:" + ruch_row + ":" + ruch_col
                    let mozliwa_pozycja = "w:" + ruch_row + ":" + ruch_col
                    for (const element of scene.children) {
                        if (element.userData.identyfikator == kordy) {
                            pokoloruj = element
                        }
                        if (element.userData.pozycja == mozliwa_pozycja) {
                            dodaj = false
                        }
                    }
                    if (dodaj) {
                        podswietlane.push(kordy)
                        pokoloruj.material.color.setRGB(0.55, 0.33, 0.22)
                    }
                }
                if (col != 0) {
                    let pokoloruj = null

                    let ruch_row = row + 1
                    let ruch_col = col - 1
                    let kordy = "p:" + ruch_row + ":" + ruch_col
                    let mozliwa_pozycja = "w:" + ruch_row + ":" + ruch_col

                    for (const element of scene.children) {
                        if (element.userData.identyfikator == kordy) {
                            pokoloruj = element
                        }
                        if (element.userData.pozycja == mozliwa_pozycja) {
                            dodaj = false
                        }
                    }
                    if (dodaj) {
                        podswietlane.push(kordy)
                        pokoloruj.material.color.setRGB(0.55, 0.33, 0.22)
                    }
                }
            }
        }
        if (kolor_pion == "bialy" && kolor == "bialy") {
            if (row != 0) {
                if (col != 7) {
                    let pokoloruj = null

                    let ruch_row = row - 1
                    let ruch_col = col + 1
                    let kordy = "p:" + ruch_row + ":" + ruch_col
                    let mozliwa_pozycja = "w:" + ruch_row + ":" + ruch_col

                    for (const element of scene.children) {
                        if (element.userData.identyfikator == kordy) {
                            element.material.color.setRGB(0.55, 0.33, 0.22)
                        }
                        if (element.userData.pozycja == mozliwa_pozycja) {
                            dodaj = false
                            break
                        }
                    }
                    if (dodaj) {
                        podswietlane.push(kordy)
                    }
                }
                if (col != 0) {
                    let pokoloruj = null
                    dodaj = true
                    let ruch_row = row - 1
                    let ruch_col = col - 1
                    let kordy = "p:" + ruch_row + ":" + ruch_col
                    let mozliwa_pozycja = "w:" + ruch_row + ":" + ruch_col
                    for (const element of scene.children) {
                        if (element.userData.identyfikator == kordy) {
                            element.material.color.setRGB(0.55, 0.33, 0.22)
                        }
                        if (element.userData.pozycja == kordy) {
                            dodaj = false
                            break
                        }
                    }
                    if (dodaj) {
                        podswietlane.push(kordy)
                    }
                }
            }
        }
    },

    Ruch: function () {

    },

    UpdateCamera(odpowiedz) {
        console.log("MAIN CAMERA ODP: " + odpowiedz);
        console.log("TO JEST ODP: " + odpowiedz["odp"]);
        if (odpowiedz["odp"] == "dodany") {
            camera.threeCamera.position.set(10, 5, 3)


            console.log("mog");
        }
        if (odpowiedz["odp"] == "drugi") {
            camera.threeCamera.position.set(-3, 5, 3)
            camera.threeCamera.rotation.set(5, Math.PI - 1, 0);
            camera.threeCamera.lookAt(0, 3.3, 3);
            console.log("drugi")
            Start_gry = true
        }
    }

}

export { GameObject, scene, szachownica, pionki, kolor }
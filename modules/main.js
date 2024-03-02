import { Scene, Clock, Raycaster, Vector2, ArrowHelper } from 'three';
import Renderer from './renderer';
import Camera from './camera';
import TWEEN, { Tween, Easing } from '@tweenjs/tween.js';
import { FunkcjeSocketow } from './net';
let highlightedPawn = null;
let curr_tween
let kolor
let tura
let podswietlane = []
let timer = 5
let countdown
const container = document.getElementById('root')
const scene = new Scene()
const renderer = new Renderer(scene, container)
const camera = new Camera(renderer.threeRenderer)
const raycaster = new Raycaster();
const mouseVector = new Vector2()

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
        tura = kolor == "bialy" ? "twoja" : "przeciwnik"

    },

    render() {


        renderer.render(scene, camera.threeCamera);

        requestAnimationFrame(GameObject.render);
        if (curr_tween) {
            curr_tween.update()
        }
    },
    Start_ruszania() {
        window.addEventListener("mousedown", (e) => {
            if (tura == "twoja") {
                GameObject.Czyszczenie_pol()
                let kolor_piona
                mouseVector.x = (e.clientX / window.innerWidth) * 2 - 1;
                mouseVector.y = -(e.clientY / window.innerHeight) * 2 + 1;
                raycaster.setFromCamera(mouseVector, camera.threeCamera)

                const intersects = raycaster.intersectObjects(scene.children);
                if (intersects.length > 0) {
                    console.log("TEST POZYCJI!: " + intersects[0].object.position.y);
                    if (intersects[0].object.material.color.r === 0) {
                        kolor_piona = "czarny"
                    }
                    if (intersects[0].object.material.color.r === 255) {
                        kolor_piona = "bialy"
                    }
                    let pion = intersects[0].object
                    if (pion.userData.identyfikator.split(":")[0] == "w") {
                        GameObject.Czyszczenie_pol()
                        podswietlane = []
                        console.log("NO CO JEST KURWA");
                    }
                    console.log(podswietlane + ": OBECNA TABLICA KURWA MACAIOFESUHFQ8F");
                    GameObject.Podswietlenie_piona(kolor_piona, pion)

                    GameObject.Mozliweruchy(pion.userData.identyfikator, kolor_piona)
                    if (highlightedPawn && intersects[0].object.userData.identyfikator.split(":")[0] == "p" && podswietlane.includes(intersects[0].object.userData.identyfikator)) {
                        GameObject.Ruch(highlightedPawn, intersects[0].object.position)
                        GameObject.Aktualizacja_indexu(intersects[0].object.userData.identyfikator)
                    }
                }
            } else {
                console.log("NIE TWOJA TURA ZACZEKAJ NO");
            }
        });
    },

    Aktualizacja_indexu: function (ruszony) {
        console.log("TO JEST RUSZONY WAZNE!!!!: " + ruszony);
        let index = podswietlane.indexOf(ruszony)
        let nowy_kord = podswietlane[index]
        nowy_kord = nowy_kord.split(":")
        nowy_kord[0] = "w"
        nowy_kord = nowy_kord.join(":")
        highlightedPawn.userData.identyfikator = nowy_kord
        highlightedPawn = null
        console.log(podswietlane);
    },

    Podswietlenie_piona(kolor_piona, pion) {
        if (highlightedPawn) {
            if (kolor == "bialy") {
                scene.children.forEach((element) => {
                    if (element.userData.identyfikator == highlightedPawn.userData.identyfikator) {
                        element.material.color.set(255, 255, 255)

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
        }

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
        let dodaj
        let pozycje = pozycja.split(":")
        let row = parseInt(pozycje[1])
        let col = parseInt(pozycje[2])

        let dlugosc = scene.children.length
        //CZARNI:
        //row idą row + 1, więc sprawdzić czy row nie jest równy 0
        //col idą w prawo + 1 w lewo - 1, więc sprawdzić czy jest równy 0 lub 7
        if (kolor_pion == "czarny" && kolor == "czarny") {
            if (row != 7) {
                if (col != 7) {
                    let pokoloruj = null
                    dodaj = true
                    let ruch_row = row + 1
                    let ruch_col = col + 1
                    let kordy = "p:" + ruch_row + ":" + ruch_col
                    let mozliwa_pozycja = "w:" + ruch_row + ":" + ruch_col
                    for (const element of scene.children) {
                        if (element.userData.identyfikator == kordy) {
                            pokoloruj = element
                        }
                        if (element.userData.identyfikator == mozliwa_pozycja) {
                            dodaj = false
                            // no jesli znajde taki element, to musze
                        }
                    }
                    if (dodaj) {
                        podswietlane.push(kordy)
                        pokoloruj.material.color.setRGB(0.55, 0.33, 0.22)
                    }
                }
                if (col != 0) {
                    let pokoloruj = null
                    dodaj = true
                    let ruch_row = row + 1
                    let ruch_col = col - 1
                    let kordy = "p:" + ruch_row + ":" + ruch_col
                    let mozliwa_pozycja = "w:" + ruch_row + ":" + ruch_col

                    for (const element of scene.children) {
                        if (element.userData.identyfikator == kordy) {
                            pokoloruj = element
                        }
                        if (element.userData.identyfikator == mozliwa_pozycja) {
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
                    dodaj = true
                    let ruch_row = row - 1
                    let ruch_col = col + 1
                    let kordy = "p:" + ruch_row + ":" + ruch_col
                    let mozliwa_pozycja = "w:" + ruch_row + ":" + ruch_col

                    for (const element of scene.children) {
                        if (element.userData.identyfikator == kordy) {
                            pokoloruj = element

                        }
                        if (element.userData.identyfikator == mozliwa_pozycja) {
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
                    dodaj = true
                    let ruch_row = row - 1
                    let ruch_col = col - 1
                    let kordy = "p:" + ruch_row + ":" + ruch_col
                    let mozliwa_pozycja = "w:" + ruch_row + ":" + ruch_col
                    for (const element of scene.children) {
                        if (element.userData.identyfikator == kordy) {
                            pokoloruj = element
                        }

                        if (element.userData.identyfikator == mozliwa_pozycja) {
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
    },

    Czyszczenie_pol: function () {
        if (podswietlane.length != 0) {
            podswietlane.forEach((element) => {
                scene.children.forEach((pole) => {
                    if (pole.userData.identyfikator == element) {
                        pole.material.color.setRGB(1, 1, 1)
                    }
                })
            })
        }
    },

    Ruch: function (pion, pozycje) {
        const uniqueIdentifier = pion.userData.identyfikator;
        const selectedObject = scene.children.find(obj => obj.userData.identyfikator === uniqueIdentifier);

        if (selectedObject) {

            const targetPosition = { x: selectedObject.position.x, y: selectedObject.position.y, z: selectedObject.position.z };

            const tween = new Tween(targetPosition)
                .to({
                    x: pozycje.x,
                    z: pozycje.z
                }, 1000)
                .easing(Easing.Bounce.Out)
                .onUpdate(() => {

                    selectedObject.position.x = targetPosition.x;
                    selectedObject.position.z = targetPosition.z;
                })
                .onComplete(() => {
                    console.log("koniec animacji");
                })
                .start();
            curr_tween = tween;
            FunkcjeSocketow.Ruszenie(pion, pozycje, "nie")
            tura = "przeciwnik"
            clearInterval(countdown)
            timer = 5
        }
    },

    Ruch_przeciwnik: function (pion, pozycje, zbicie) {
        console.log("CZY RUCH DOSZEDDL?");
        console.log("PION: " + pion.userData);
        console.log("POZYCJE: " + pozycje);
        console.log("zbicie: " + zbicie);
        const uniqueIdentifier = pion.userData.identyfikator;
        const selectedObject = scene.children.find(obj => obj.userData.identyfikator === uniqueIdentifier);

        if (selectedObject) {

            const targetPosition = { x: selectedObject.position.x, y: selectedObject.position.y, z: selectedObject.position.z };

            const tween = new Tween(targetPosition)
                .to({
                    x: pozycje.x,
                    z: pozycje.z
                }, 1000)
                .easing(Easing.Bounce.Out)
                .onUpdate(() => {

                    selectedObject.position.x = targetPosition.x;
                    selectedObject.position.z = targetPosition.z;
                })
                .onComplete(() => {
                    console.log("koniec animacji");
                })
                .start();
            curr_tween = tween;
            let nowe_miejsce = "p:" + pozycje.x + ":" + pozycje.z
            podswietlane.push(nowe_miejsce)
            highlightedPawn = selectedObject
            GameObject.Aktualizacja_indexu(nowe_miejsce)
            podswietlane = []
            highlightedPawn = null
            tura = "twoja"
            countdown = setInterval(() => {
                if (timer < 1) {
                    FunkcjeSocketow.Przegrana_czas()
                    console.log("PRZEGRALES!!");
                    tura = "przeciwnik"
                    clearInterval(countdown)
                }
                timer -= 1
                console.log(timer);
            }, 1000);
        }
    },

    Wygrana_czas: function () {
        tura = "przeciwnik"
        console.log("GRATUALCJE UZYTKOWNIKU WYGRALES NA CZAS!!!");
        clearInterval(countdown)
    },

    Animacja: function (warcab, pole, zbicie) {
        console.log("ANIMACJA DATA WARCAB: " + zbicie);
        console.log("ANIMACJA DATA POLE: " + pole);
        console.log("ANIMACJA DATA ZBICIE: " + warcab);
        console.log("KLUCZE OBIEKTU WARCAB: " + Object.keys(warcab.object));
        GameObject.Ruch_przeciwnik(warcab.object, pole, zbicie)
    },

    Start_clock: function () {
        if (kolor == "bialy") {
            countdown = setInterval(() => {
                if (timer < 1) {
                    FunkcjeSocketow.Przegrana_czas()
                    console.log("PRZEGRALES!!");
                    tura = "przeciwnik"
                    clearInterval(countdown)
                }
                timer -= 1
                console.log(timer);
            }, 1000);
        }
    },

    UpdateCamera(odpowiedz) {

        if (odpowiedz["odp"] == "dodany") {
            camera.threeCamera.position.set(10, 5, 3)

        }
        if (odpowiedz["odp"] == "drugi") {
            camera.threeCamera.position.set(-3, 5, 3)
            camera.threeCamera.rotation.set(5, Math.PI - 1, 0);
            camera.threeCamera.lookAt(0, 3.3, 3);
            FunkcjeSocketow.Start_gry()
        }
    }

}

export { GameObject, scene, szachownica, pionki, kolor }
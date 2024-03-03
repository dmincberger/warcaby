import { Scene, Clock, Raycaster, Vector2, ArrowHelper, TextureLoader } from 'three';
import Renderer from './renderer';
import Camera from './camera';
import TWEEN, { Tween, Easing } from '@tweenjs/tween.js';
import { FunkcjeSocketow } from './net';
import { allEvents } from './ui';
let potencjalne_zbicie = []
let zbicie_holder
let highlightedPawn = null;
let curr_tween
let kolor
let tura
let podswietlane = []
let timer = 30
let countdown
let czarna_tekstura = new TextureLoader().load('./static/images/czarny_pion.jpg')
let bialy_tekstura = new TextureLoader().load('./static/images/bialy_pion.jpg')
let czarna_tekstura_src = "http://localhost:3000/static/images/czarny_pion.jpg"
let biala_tekstura_src = "http://localhost:3000/static/images/bialy_pion.jpg"
let wybrany = new TextureLoader().load('./static/images/wybrany.jpg')
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

                    if (intersects[0].object.material.map.image.src == czarna_tekstura_src) {
                        kolor_piona = "czarny"


                    }
                    if (intersects[0].object.material.map.image.src == biala_tekstura_src) {
                        kolor_piona = "bialy"


                    }
                    let pion = intersects[0].object
                    if (pion.userData.identyfikator.split(":")[0] == "w") {
                        GameObject.Czyszczenie_pol()
                        podswietlane = []
                    }

                    GameObject.Podswietlenie_piona(kolor_piona, pion)

                    GameObject.Mozliweruchy(pion.userData.identyfikator, kolor_piona)
                    if (highlightedPawn && intersects[0].object.userData.identyfikator.split(":")[0] == "p" && podswietlane.includes(intersects[0].object.userData.identyfikator)) {
                        GameObject.Ruch(highlightedPawn, intersects[0].object.position)
                        GameObject.Aktualizacja_indexu(intersects[0].object.userData.identyfikator)
                    }
                }
            } else {
            }
        });
    },

    Aktualizacja_indexu: function (ruszony) {

        let index = podswietlane.indexOf(ruszony)
        let nowy_kord = podswietlane[index]
        nowy_kord = nowy_kord.split(":")
        nowy_kord[0] = "w"
        nowy_kord = nowy_kord.join(":")
        highlightedPawn.userData.identyfikator = nowy_kord
        highlightedPawn = null

    },

    Podswietlenie_piona(kolor_piona, pion) {
        if (highlightedPawn) {
            if (kolor == "bialy") {
                scene.children.forEach((element) => {
                    if (element.userData.identyfikator == highlightedPawn.userData.identyfikator) {
                        element.material.map = bialy_tekstura
                    }
                })
            }
            if (kolor == "czarny") {
                scene.children.forEach((element) => {
                    if (element.userData.identyfikator == highlightedPawn.userData.identyfikator) {
                        element.material.map = czarna_tekstura
                    }
                })
            }
        }

        if (kolor == kolor_piona) {
            scene.children.forEach((element) => {
                if (element.userData.identyfikator == pion.userData.identyfikator) {
                    highlightedPawn = element
                    element.material.map = wybrany
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
                    zbicie_holder = null

                    let potencjalny_kolor = null
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
                            zbicie_holder = element
                            potencjalny_kolor = element
                            let zbicie_row = ruch_row + 1
                            let zbicie_col = ruch_col + 1
                            let kordy_zbicia_warcab = "w:" + zbicie_row + ":" + zbicie_col
                            let kordy_zbicia_pole = "p:" + zbicie_row + ":" + zbicie_col
                            let mozliwosc_zbicia = true
                            if (col == 6) {
                                mozliwosc_zbicia = false
                            }
                            if (element.userData.kolor == kolor) {
                                mozliwosc_zbicia = false
                            }
                            for (const warcaby of scene.children) {
                                if (warcaby.userData.identyfikator == kordy_zbicia_warcab) {
                                    mozliwosc_zbicia = false
                                }
                                if (warcaby.userData.identyfikator == kordy_zbicia_pole) {
                                    potencjalny_kolor = warcaby
                                }
                            }
                            if (mozliwosc_zbicia == false) {
                                dodaj = false
                            } else {
                                pokoloruj = potencjalny_kolor
                                kordy = kordy_zbicia_pole
                            }
                        }
                    }
                    if (dodaj) {
                        if (zbicie_holder) {
                            potencjalne_zbicie.push(zbicie_holder)
                        }
                        podswietlane.push(kordy)
                        pokoloruj.material.color.setRGB(0.55, 0.33, 0.22)
                    }
                }
                if (col != 0) {
                    zbicie_holder = null

                    let pokoloruj = null
                    dodaj = true
                    let ruch_row = row + 1
                    let ruch_col = col - 1
                    let kordy = "p:" + ruch_row + ":" + ruch_col
                    let mozliwa_pozycja = "w:" + ruch_row + ":" + ruch_col
                    let potencjalny_kolor = null
                    for (const element of scene.children) {
                        if (element.userData.identyfikator == kordy) {
                            pokoloruj = element
                        }
                        if (element.userData.identyfikator == mozliwa_pozycja) {
                            // no jesli znajde taki element, to musze najpierw sprawdzic gdzie chce zbijac
                            potencjalny_kolor = element
                            zbicie_holder = element

                            let zbicie_row = ruch_row + 1
                            let zbicie_col = ruch_col - 1
                            let kordy_zbicia_warcab = "w:" + zbicie_row + ":" + zbicie_col
                            let kordy_zbicia_pole = "p:" + zbicie_row + ":" + zbicie_col

                            let mozliwosc_zbicia = true
                            if (col == 1) {
                                mozliwosc_zbicia = false
                            }
                            if (element.userData.kolor == kolor) {
                                mozliwosc_zbicia = false
                            }
                            for (const warcaby of scene.children) {
                                if (warcaby.userData.identyfikator == kordy_zbicia_warcab) {
                                    mozliwosc_zbicia = false
                                }
                                if (warcaby.userData.identyfikator == kordy_zbicia_pole) {
                                    potencjalny_kolor = warcaby
                                }
                            }
                            if (mozliwosc_zbicia == false) {
                                dodaj = false
                            } else {
                                kordy = kordy_zbicia_warcab
                                pokoloruj = potencjalny_kolor
                                kordy = kordy_zbicia_pole

                            }
                        }
                    }
                    if (dodaj) {
                        if (zbicie_holder) {
                            potencjalne_zbicie.push(zbicie_holder)

                        }

                        podswietlane.push(kordy)
                        pokoloruj.material.color.setRGB(0.55, 0.33, 0.22)
                    }
                }
            }
        }
        if (kolor_pion == "bialy" && kolor == "bialy") {
            if (row != 0) {
                if (col != 7) {
                    zbicie_holder = null

                    let potencjalny_kolor = null
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
                            zbicie_holder = element
                            potencjalny_kolor = element
                            let zbicie_row = ruch_row - 1
                            let zbicie_col = ruch_col + 1
                            let kordy_zbicia_warcab = "w:" + zbicie_row + ":" + zbicie_col
                            let kordy_zbicia_pole = "p:" + zbicie_row + ":" + zbicie_col
                            let mozliwosc_zbicia = true
                            if (col == 6) {
                                mozliwosc_zbicia = false
                            }
                            if (element.userData.kolor == kolor) {
                                mozliwosc_zbicia = false
                            }
                            for (const warcaby of scene.children) {
                                if (warcaby.userData.identyfikator == kordy_zbicia_warcab) {
                                    mozliwosc_zbicia = false
                                }
                                if (warcaby.userData.identyfikator == kordy_zbicia_pole) {
                                    potencjalny_kolor = warcaby
                                }
                            }
                            if (mozliwosc_zbicia == false) {
                                dodaj = false
                            } else {
                                pokoloruj = potencjalny_kolor
                                kordy = kordy_zbicia_pole
                            }
                        }
                    }
                    if (dodaj) {
                        if (zbicie_holder) {
                            if (zbicie_holder) {
                                potencjalne_zbicie.push(zbicie_holder)
                            }
                        }
                        podswietlane.push(kordy)
                        pokoloruj.material.color.setRGB(0.55, 0.33, 0.22)
                    }
                }
                if (col != 0) {
                    zbicie_holder = null

                    let potencjalny_kolor = null
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
                            zbicie_holder = element

                            potencjalny_kolor = element
                            let zbicie_row = ruch_row - 1
                            let zbicie_col = ruch_col - 1
                            let kordy_zbicia_warcab = "w:" + zbicie_row + ":" + zbicie_col
                            let kordy_zbicia_pole = "p:" + zbicie_row + ":" + zbicie_col
                            let mozliwosc_zbicia = true
                            if (col == 1) {
                                mozliwosc_zbicia = false
                            }
                            if (element.userData.kolor == kolor) {
                                mozliwosc_zbicia = false
                            }
                            for (const warcaby of scene.children) {
                                if (warcaby.userData.identyfikator == kordy_zbicia_warcab) {
                                    mozliwosc_zbicia = false
                                }
                                if (warcaby.userData.identyfikator == kordy_zbicia_pole) {
                                    potencjalny_kolor = warcaby
                                }
                            }
                            if (mozliwosc_zbicia == false) {
                                dodaj = false
                            } else {
                                pokoloruj = potencjalny_kolor
                                kordy = kordy_zbicia_pole
                            }
                        }
                    }
                    if (dodaj) {
                        if (zbicie_holder) {
                            potencjalne_zbicie.push(zbicie_holder)
                        }
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
        let do_zbicia = null
        let do_zbicia_info = null
        let pierwszy = true
        if (selectedObject) {
            let tescik = selectedObject.position.x
            let tescik_pozycje = pozycje.x
            let glob = tescik - tescik_pozycje
            if (Math.abs(glob) > 1) {
                if (potencjalne_zbicie.length == 1) {
                    do_zbicia_info = potencjalne_zbicie[0].userData.identyfikator
                    do_zbicia = potencjalne_zbicie[0]
                    console.log("TUTAJ JEST PROBLEM??: " + do_zbicia_info);
                }
                if (potencjalne_zbicie.length > 1) {
                    let pozycja_z = parseInt(pozycje.z)
                    let pion_z = parseInt(potencjalne_zbicie[0].position.z)
                    let odleglosc = pozycja_z - pion_z
                    if (odleglosc == 1) {
                        do_zbicia = potencjalne_zbicie[0]
                        do_zbicia_info = potencjalne_zbicie[0].userData.identyfikator
                    } else {
                        do_zbicia = potencjalne_zbicie[1]
                        do_zbicia_info = potencjalne_zbicie[1].userData.identyfikator
                    }
                }
            }
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

                })
                .start();
            curr_tween = tween;
            FunkcjeSocketow.Ruszenie(pion, pozycje, do_zbicia_info)
            tura = "przeciwnik"
            clearInterval(countdown)
            timer = 30
            scene.remove(do_zbicia)
            potencjalne_zbicie = []
            do_zbicia_info = null
            do_zbicia = null
            // GameObject.Win_check()
            allEvents.tura_przeciwnika()
        }
    },

    Ruch_przeciwnik: function (pion, pozycje, zbicie) {
        console.log("DO ZBICIAFEFWFWEEEEEEEEEEEE:" + zbicie);
        const uniqueIdentifier = pion.userData.identyfikator;
        const selectedObject = scene.children.find(obj => obj.userData.identyfikator === uniqueIdentifier);
        if (selectedObject) {
            if (zbicie != null) {
                for (const element of scene.children) {
                    if (element.userData.identyfikator == zbicie) {
                        scene.remove(element)
                        break
                    }
                }
            } else {
            }
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
                    allEvents.Przegrana_czas()
                    FunkcjeSocketow.Przegrana_czas()
                    tura = "przeciwnik"
                    clearInterval(countdown)
                    console.log("PRZEGRALES NA CZAS :(");
                }
                console.log(timer);
                timer -= 1
                allEvents.twoja_tura(timer)
            }, 1000);
        }
    },

    Wygrana_czas: function () {
        tura = "przeciwnik"
        clearInterval(countdown)
        console.log("GRATULACJE WYGRALES NA CZAS");
        allEvents.Wygrana_czas()
    },

    Animacja: function (warcab, pole, zbicie) {

        GameObject.Ruch_przeciwnik(warcab.object, pole, zbicie)
    },

    Start_clock: function () {
        if (kolor == "bialy") {
            countdown = setInterval(() => {
                if (timer < 1) {
                    allEvents.Przegrana_czas()
                    console.log("TESTETOKETKOWO CZAS");
                    FunkcjeSocketow.Przegrana_czas()
                    tura = "przeciwnik"
                    clearInterval(countdown)
                } else {
                    console.log(timer);
                    timer -= 1
                    allEvents.twoja_tura(timer)
                }
            }, 1000);
        } else {
        }
    },

    Win_check() {
        if (kolor == "bialy") {
            for (const element of scene.children) {
                if (element.material.map.img.src == biala_tekstura_src) {
                    return 0
                }
            }
        } else {
            for (const element of scene.children) {
                if (element.material.map.img.src == czarna_tekstura_src) {
                    return 0
                }
            }
        }
        allEvents.Koniec_gry_wygrana()
        FunkcjeSocketow.Koniec_gry()
        return 1
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
            allEvents.tura_przeciwnika()
        }
    }

}

export { GameObject, scene, szachownica, pionki, kolor }
import { allNetFunctions, FunkcjeSocketow } from "./net";
import Camera from './camera.js'
import { plansza } from "./plansza";
import { GameObject } from "./main";
const allEvents = {
    async init() {
        let loginbt = document.getElementById("loginbt");
        let userName_field = document.getElementById("userName");

        loginbt.addEventListener("click", async function () {
            let userName = userName_field.value;
            try {
                let odpowiedz = await allNetFunctions.loginUser(userName);
                // console.log(odpowiedz);
                allEvents.koniec(odpowiedz)
                GameObject.UpdateCamera(odpowiedz)
            } catch (error) {
                console.error("Error during login:", error);
            }
        });

        let resetbt = document.getElementById("resetbt");
        resetbt.addEventListener("click", async function () {
            FunkcjeSocketow.Reset_gry()
        });
    },

    koniec(odpowiedz) {

        if (odpowiedz["odp"] == "dodany") {
            document.getElementById("logowanie").close()
            document.getElementById("status").innerHTML = "USER_ADDED"
            document.getElementById("komunikat").innerHTML = `Witaj ${odpowiedz["userName"]}, grasz ${odpowiedz["kolor"]}`
            plansza.generacja_pionkow(odpowiedz["odp"])
            allEvents.czekanie()
            allNetFunctions.waitplayer()
            GameObject.ustawienie_koloru(odpowiedz["kolor"])

        }
        console.log("TO JEST LOG: " + odpowiedz["odp"]);

        if (odpowiedz["odp"] == "drugi") {
            document.getElementById("logowanie").close()
            document.getElementById("status").innerHTML = "USER_ADDED"
            document.getElementById("komunikat").innerHTML = `Witaj ${odpowiedz["userName"]}, grasz ${odpowiedz["kolor"]}`
            plansza.generacja_pionkow(odpowiedz["odp"])
            GameObject.Start_ruszania()
            GameObject.ustawienie_koloru(odpowiedz["kolor"])
            FunkcjeSocketow.Zamknij_modal()
        }
        if (odpowiedz["odp"] == "istniejacy") {
            document.getElementById("status").innerHTML = "Uzytkownik juz istnieje!"

        }
        if (odpowiedz["odp"] == "duzo") {
            document.getElementById("status").innerHTML = "Za duzo uzytkownikow juz jest!"
        }
    },

    czekanie() {
        document.getElementById("czekanie").showModal()
    },

    startgry() {
        document.getElementById("czekanie").close()
    },

    twoja_tura(timer) {
        let status = document.getElementById("status")
        status.innerHTML = "TWOJA TURA\nZostało ci: " + timer + "s"
    },

    tura_przeciwnika() {
        let status = document.getElementById("status")
        status.innerHTML = "OBECNIE JEST TURA PRZECIWNIKA"
    },

    Wygrana_czas() {
        let status = document.getElementById("status")
        status.innerHTML = "WYGRANA POPRZEZ BRAK RUCHU PRZECIWNIKA"
    },

    Zamknij_modal() {
        document.getElementById("czekanie").close()
    },

    Koniec_gry_wygrana() {
        document.getElementById("koniec").showModal()
        document.getElementById("koniec_tekst").innerHTML = "WYGRALES!!"
    },

    Koniec_gry_przegrana() {
        document.getElementById("koniec").showModal()
        document.getElementById("koniec_tekst").innerHTML = "PRZEGRALES"
        setTimeout(() => {
            location.reload()
        }, 3000);
    },

    Przegrana_czas() {
        console.log("PRZEGRANA SIĘ WYKONUJE PRZECIEŻŻ");
        let status = document.getElementById("status")
        console.log(status.innerHTML + "STATUS PRZED ZMIANIE");
        status.innerHTML = "PRZEGRANA PONIEWAŻ NIE WYKONAŁEŚ RUCHU"
        console.log(status.innerHTML + "STATUS PO ZMIANIE");
    },

}

export { allEvents }
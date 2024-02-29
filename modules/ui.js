import { allNetFunctions } from "./net";
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
            try {
                console.log("resetBt");
                let resetData = await allNetFunctions.resetUsers();

            } catch (error) {
                console.error("Error during reset:", error);
            }
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
    }

}

export { allEvents }
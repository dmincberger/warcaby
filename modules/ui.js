import { allNetFunctions } from "./net";
import { plansza } from "./plansza";
const allEvents = {
    async init() {
        let loginbt = document.getElementById("loginbt");
        let userName_field = document.getElementById("userName");

        loginbt.addEventListener("click", async function () {
            let userName = userName_field.value;
            try {
                let odpowiedz = await allNetFunctions.loginUser(userName);
                allEvents.koniec(odpowiedz)
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
            plansza.generacja_pionkow()
        } if (odpowiedz["odp"] == "istniejacy") {
            document.getElementById("status").innerHTML = "Uzytkownik juz istnieje!"
        }
    }

}

export { allEvents }
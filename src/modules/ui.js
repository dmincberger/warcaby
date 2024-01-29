import { allNetFunctions } from "./net";
const allEvents = {
    async init() {
        let loginbt = document.getElementById("loginbt");
        let userName_field = document.getElementById("userName");

        loginbt.addEventListener("click", async function () {
            let userName = userName_field.value;
            try {
                let odpowiedz = await allNetFunctions.loginUser(userName);

                allEvents.koniec(odpowiedz["odp"])
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

        if (odpowiedz == "dodany") {
            document.getElementById("logowanie").close()
            console.log("pomyslnie dodany");
        } else if (odpowiedz == "istniejacy") {

        }
    }

}

export { allEvents }
import { io } from "https://cdn.socket.io/4.6.0/socket.io.esm.min.js";
const socket = io();



const FunkcjeSocketow = {
    Dodano: socket.on('Dodanoe', (data) => {
        console.log(`User added: ${data.Wiadomosc}`);
    }),

    Rozlaczenie: socket.on("disconnect", (data) => {
        console.log(data.reason)
    }),

    Ruszony: socket.on('Animacja', (data) => {
        // console.log("SPRAWDZ KURWA DATAZBICIEFPOJWEEJIEWWIJWEJI: " + data["zbicie"]);
        GameObject.Animacja(data["warcab"], data["pole"], data["zbicie"])
    }),

    Ruszenie: (warcab, pole, zbicie) => {
        console.log("WYKONANO SIE, TO JEST DATA: " + zbicie);
        socket.emit('Ruszony', { warcab: warcab, pole: pole, zbicie: zbicie })
    },

    Start_gry: () => { socket.emit('Start_gry', (data) => { start: "tak" }) },
    Start_timer: socket.on('Start_timer', (data) => { GameObject.Start_clock() }),
    Przegrana_czas: () => { socket.emit('Przegrana_czas'), (data) => { przegrana: "przegrana" } },
    Koniec_czas: socket.on("Koniec_czas", (data) => { GameObject.Wygrana_czas() })
}
import { GameObject } from "./main"
import { allEvents } from "./ui"
const allNetFunctions = {
    loginUser(userName) {
        return new Promise((resolve, reject) => {
            event.preventDefault();
            const data = JSON.stringify({
                userName: userName
            });
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: data
            };

            fetch("/adduser", options)
                .then(response => {
                    if (!response.ok) {
                        console.log("CO SIE DZIEJE NO");
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    if (data["odp"] === "dodany" || data["odp"] === "drugi" || data["odp"] === "duzo") {
                        resolve(data);
                    } else {
                        reject(new Error('Response not "dodany" or drugi'));
                    }
                })
                .catch(error => {
                    console.error('Error during data save:', error);
                    reject(error);
                });
        });
    },

    resetUsers() {

        fetch("/resetUsers", options)
            .then(response => response.json())
            .then(data => {

            })
            .catch(error => console.log(error));


    },

    waitplayer() {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
        };
        let oczekiwanie = setInterval(() => {
            fetch("/waitplayer", options)
                .then(response => response.json())
                .then(data => {
                    if (data["odp"] == "start") {
                        clearInterval(oczekiwanie)
                        allEvents.startgry()
                        GameObject.Start_ruszania()
                    }
                })
                .catch(error => console.log(error));
        }, 1000);
    }

}

export { allNetFunctions, FunkcjeSocketow }
import { io } from "https://cdn.socket.io/4.6.0/socket.io.esm.min.js";
const socket = io();
window.addEventListener("mousemove", (e) => {
    socket.emit('mousePosition', { posX: e.clientX })
})
const FunkcjeSocketow = {
    Dodano: socket.on('Dodano', (data) => {
        console.log(`User added: ${data.Wiadomosc}`);
    }),

    Rozlaczenie: socket.on("disconnect", (data) => {
        console.log(data.reason)
    }),
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
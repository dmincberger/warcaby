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
            console.log("tescik?");
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

export { allNetFunctions }
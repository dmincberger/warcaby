import { GameObject } from "./main"
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
                    if (data["odp"] === "dodany" || data["odp"] === "istniejacy") {
                        resolve(data);
                    } else {
                        reject(new Error('Response not "dodany"'));
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


    }

}

export { allNetFunctions }
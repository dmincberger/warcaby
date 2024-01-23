import { GameObject } from "./main"
const allNetFunctions = {

    loginUser(userName) {
        event.preventDefault()
        const data = JSON.stringify({
            userName: userName
        })
        console.log(userName);
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
            })
            .catch(error => {
                console.error('Error during data save:', error);
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
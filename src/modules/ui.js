import { allNetFunctions } from "./net";
const allEvents = {
    init() {
        let loginbt = document.getElementById("loginbt")
        let userName_field = document.getElementById("userName")
        loginbt.addEventListener("click", function () {
            let userName = userName_field.value
            allNetFunctions.loginUser(userName)
        })

        let resetbt = document.getElementById("resetbt")
        resetbt.addEventListener("click", function () {

            console.log("resetBt");

            allNetFunctions.resetUsers()
        })


    }

}

export { allEvents }
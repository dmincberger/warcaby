const express = require("express")
const app = express()
const PORT = 3000
const path = require("path")
const bodyParser = require('body-parser');
app.use(express.json())
app.use(bodyParser.json());
app.use(express.static("dist"))
app.use(express.text())
let users = []
let waiting_users = []
let odpowiedzi_kolory = { "istniejacy": "bialy" }

app.get("/", function (req, res) {
    res.sendFile("index.html")
})

app.post("/adduser", function (req, res) {
    res.header("content-type", "application/json")
    let userName = req.body["userName"]
    if (!users.includes(userName)) {
        console.log("DODANO DO TABELI: ", userName);
        if (users.length == 2) { waiting_users.push(userName) }
        else {
            users.push(userName)
        }
        let odp = "dodany"
        let kolor = "test"
        res.send(JSON.stringify({ odp: odp, kolor: kolor, userName: userName }))
    } else {
        console.log("TABELA NIE PRZYJELJA: ", userName);
        let odp = "istniejacy"
        let kolor = "test"
        res.send(JSON.stringify({ odp: odp }))
    }
})

app.listen(PORT, function () {
    console.log("SERWER DZIALA NA PORCIE ", PORT);
})
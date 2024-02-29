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
        console.log(users);
        console.log("DODANO DO TABELI: ", userName);
        if (users.length == 0) {
            console.log("no kurwa mac");
            let odp = "dodany"
            let kolor = "bialy"
            users.push(userName)
            res.send(JSON.stringify({ odp: odp, kolor: kolor, userName: userName }))
        }
        else if (users.length == 1) {
            console.log("kurwa v2");
            let odp = "drugi"
            let kolor = "czarny"
            users.push(userName)
            res.send(JSON.stringify({ odp: odp, kolor: kolor, userName: userName }))
        } else if (users.length > 1) {
            let odp = "duzo"
            users.push(userName)
            res.send(JSON.stringify({ odp: odp }))
        }
    } else {
        console.log("TABELA NIE PRZYJELJA: ", userName);
        let odp = "istniejacy"
        res.send(JSON.stringify({ odp: odp }))
    }
})

app.post("/waitplayer", function (req, res) {
    if (users.length > 1) {
        res.send(JSON.stringify({ odp: "start" }))
    } else {
        res.send(JSON.stringify({ odp: "czekaj" }))
    }
})

app.listen(PORT, function () {
    console.log("SERWER DZIALA NA PORCIE ", PORT);
})
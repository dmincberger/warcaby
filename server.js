const express = require("express")
const app = express()
const http = require('http');
const server = http.createServer(app)
const PORT = 3000
const { Server } = require("socket.io");
const socketio = new Server(server);
const path = require("path")
const bodyParser = require('body-parser');
app.use(express.json())
app.use(bodyParser.json());
app.use(express.static("dist"))
app.use(express.text())
let users = []
let waiting_users = []
let odpowiedzi_kolory = { "istniejacy": "bialy" }
socketio.on("connection", (client) => {
    client.emit("Dodanoe", {
        Wiadomosc: "lol"
    })
    client.on("disconnect", (reason) => {
        console.log("klient się rozłącza", reason)
    })

    client.on("mousePosition", (data) => {
        console.log(data.posX);
    })
    client.on('Ruszony', (data) => {
        console.log("dataaaaa: " + data);
        client.broadcast.emit("Animacja", { pole: data["pole"], warcab: data["warcab"], zbicie: data["zbicie"] })
        client.emit
    })

    client.on("Start_gry", (data) => {
        console.log("GRA ROZPOCZETA");
        client.broadcast.emit("Start_timer", { timer: "start" })
    })

    client.on("Przegrana_czas", (data) => {
        console.log("PRZEGRANO NA CZAS LOL");
        client.broadcast.emit("Koniec_czas", { koniec: "koniec" })
    })

})



socketio.on("mouseposition", (data) => {
    console.log(data)
    socketio.emit("mouseposition", { posX: data.posX, posY: data.posY })
})

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
            let odp = "drugi"
            let kolor = "czarny"
            users.push(userName)
            socketio.emit('Dodano', { userName })
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

server.listen(PORT, function () {
    console.log("SERWER DZIALA NA PORCIE ", PORT);
})
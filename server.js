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
app.get("/", function (req, res) {
    res.sendFile("index.html")
})

app.post("/adduser", function (req, res) {
    res.header("content-type", "application/json")
    let userName = req.body["userName"]
    if (!users.includes(userName)) {
        console.log("DODANO DO TABELI: ", userName);
        users.push(userName)
    } else {
        console.log("TABELA NIE PRZYJELJA: ", userName);
    }
    res.send(1);
})

app.listen(PORT, function () {
    console.log("SERWER DZIALA NA PORCIE ", PORT);
})
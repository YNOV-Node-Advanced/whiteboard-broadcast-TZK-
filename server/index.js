const path = require("path");
const express = require("express");
const uuidv4 = require("uuid/v4");
const ws = require("ws");

const app = express();

const PUBLIC_FOLDER = path.join(__dirname, "../public");
const PORT = process.env.PORT || 5000;

const wss = new ws.Server({ port: 8081 });
wss.on("connection", function connection(ws) {
    ws.on("message", function incoming(data) {
        console.log("received: %s", data);
        wss.clients.forEach(client => {
            if (client !== ws && client.readyState === ws.OPEN) {
                client.send(data);
            }
        });
    });
});

// Assign a random channel to people opening the application
app.get("/", (req, res) => {
    res.redirect(`/${uuidv4()}`);
});

app.get("/:channel", (req, res, next) => {
    res.sendFile(path.join(PUBLIC_FOLDER, "index.html"), {}, err => {
        if (err) {
            next(err);
        }
    });
});

app.use(express.static(PUBLIC_FOLDER));

app.listen(PORT, () => console.log(`Listening on port ${PORT}!`));

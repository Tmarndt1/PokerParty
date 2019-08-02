import { SocketService } from "./SocketServer";
import * as express from "express";
import * as path from "path";
import * as bodyParser from "body-parser";

let port = 8080;

let app = express();

app.set("port", process.env.PORT || port);

app.use(express.static("../../dist"));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

let http = require("http").Server(app);

// update file location on prod build
app.get("/", (req: any, res: any) => {
    res.sendFile(path.join("../../dist/index.html"));
});

const server = http.listen(port, () => {
    console.log("listening on *:" + port);
});

const socketServer = new SocketService(server);
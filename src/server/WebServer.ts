// src/server.ts
import * as express from "express";

export default class WebServer {
    private port: string;
    private express: any;
    private server: any;

    constructor(port: number) {
        this.port = port.toString();
        this.express = express();
        this.express.set("port", port);
        let http = require("http").Server(this.express);
        this.server = http.listen(port, () => {
            console.log("listening on *:" + port);
        });
    }

    public getServer = (): any => {
        return this.server;
    }

    public stop = (): void => {
        console.log("closed connection on *:" + this.port);
        this.server.close();
    }
}

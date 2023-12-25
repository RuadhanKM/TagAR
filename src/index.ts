import express, { Express, Request, Response } from "express";
import https from "https"

const app: Express = express();
const port = 3000;
const address = process.env.ADDR || "localhost"

var credentials = {key: process.env.SSL_PRIVATE_KEY?.replace(/\\n/gm, "\n"), cert: process.env.SSL_CERT?.replace(/\\n/gm, "\n")};

app.use(express.static('src/public'))
app.use(express.static('src/static'))

var httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, address, () => {
    console.log(`Server is running at https://${address}:${port}`);
});
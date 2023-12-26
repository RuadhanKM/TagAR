import express, { Express, Request, Response } from "express";
import https from "https"

const app: Express = express();
const port = 3000;
const address = process.env.ADDR || "localhost"

const credentials = {key: process.env.SSL_PRIVATE_KEY?.replace(/\\n/gm, "\n"), cert: process.env.SSL_CERT?.replace(/\\n/gm, "\n")};

const textureMain = new Uint8ClampedArray(1024 * 1024).map(x => Math.random()*500)
console.log(textureMain)

app.use(express.static('dist/public'))
app.use(express.static('src/static'))
app.get("/texture-main", (req, res) => {
    res.send(textureMain.join(" "))
})

var httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, address, () => {
    console.log(`Server is running at https://${address}:${port}`);
});
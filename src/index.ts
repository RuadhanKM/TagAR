import express, { Express, Request, Response } from "express";
import https from "https"
import zlib from "zlib";
import path from "path";

const app: Express = express();
const port = 3000;
const address = process.env.ADDR || "localhost"

const credentials = {key: process.env.SSL_PRIVATE_KEY?.replace(/\\n/gm, "\n"), cert: process.env.SSL_CERT?.replace(/\\n/gm, "\n")};

const textureMain = Buffer.alloc(1280 * 720 * 2).map(x => 0b00_00_00_00)

app.use(express.static('dist/public'))
app.use(express.static('dist/static'))

app.get("/texture-main", (req, res) => {
    if (req.header('Accept-Encoding')?.split(', ').includes('gzip')) {
        res.setHeader('Content-Encoding', 'gzip')
        return res.send(zlib.gzipSync(textureMain))
    }
    res.send(textureMain)
})

var httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, address, () => {
    console.log(`Server is running at https://${address}:${port}`);
});
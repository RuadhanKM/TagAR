import express, { Express, Request, Response } from "express";

const app: Express = express();
const port = 3000;

app.use(express.static('src/public'))

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
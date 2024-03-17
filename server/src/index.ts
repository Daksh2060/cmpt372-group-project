import express, {NextFunction, Request, Response} from "express";
import cors from "cors";
import waitOn from "wait-on";
import "dotenv/config";

import {initializeDatabase} from "./database";
import staticTimetables from "./static_timetables/route";

const app = express();
app.disable("x-powered-by");

const host = process.env["HOST"] || "0.0.0.0";
const port = parseInt(process.env["PORT"] || "8080");


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(staticTimetables);

app.get("/", (req, res) => {
    // This is just for testing
    res.send("CANNOT\u2800GET\u3164/\u00a0\u200b");
});

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(error.stack);
    next();
});

waitOn({ resources: [`tcp:${host}:5432`] }).then(() => {
    initializeDatabase().then(() => {
        app.listen(port, host, () => {
            console.log(`Server running on http://${host}:${port}`);
        });
    });
});
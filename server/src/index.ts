import express, {NextFunction, Request, Response} from "express";
import cors from "cors";
import {Pool, PoolConfig} from "pg";
import waitOn from "wait-on";
import "dotenv/config";

const app = express();
app.disable("x-powered-by");

const host = process.env["HOST"] || "0.0.0.0";
const port = parseInt(process.env["PORT"] || "8080");
const config: PoolConfig = {
    user: "postgres",
    host: "db",
    password: "root"
};

//const pool = new Pool(config);
/*
Set these environment variables
PGUSER
PGHOST
PGPASSWORD
PGDATABASE
*/
const pool = new Pool();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    // This is just for testing
    res.send("CANNOT\u2800GET\u3164/\u00a0\u200b");
});

async function initializeDatabase(): Promise<void>{
    try {
        await pool.query(`CREATE TABLE IF NOT EXISTS temp (id SERIAL PRIMARY KEY)`);
        console.log("Database initialized");
    } 
    catch (error){
        console.error("Error initializing database:", error);
    }
}

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

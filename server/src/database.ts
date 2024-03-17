import {Pool, PoolConfig} from "pg";
import {Request, Response, NextFunction} from "express";
import {Empty} from "./types";

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

export async function initializeDatabase(): Promise<void>{
    try {
        await pool.query(`CREATE TABLE IF NOT EXISTS temp (id SERIAL PRIMARY KEY)`);
        console.log("Database initialized");
    } 
    catch (error){
        console.error("Error initializing database:", error);
    }
}

type ExpressCallback<R, Q> = (req: Request<Empty, Empty, R, Q>, res: Response, next: NextFunction) => void;

export function databaseErrorHandler<R, Q = unknown>(callback: ExpressCallback<R, Q>): ExpressCallback<R, Q>{
    // Checks for database errors within a callback function and sends an internal server error response if one occurs
    return (req: Request<Empty, Empty, R, Q>, res: Response, next: NextFunction) => {
        Promise.resolve(callback(req, res, next)).catch((reason) => {
            console.log(reason);
            res.status(500).send("Database error.");
        });
    }
}

export const helpers = {
    test: async () => {
        const data = await pool.query<{id: number}, [number]>("SELECT * FROM temp WHERE id = $1", [0]);
        return data.rows;
    }
};

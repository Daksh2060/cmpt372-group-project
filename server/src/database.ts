import {Pool, PoolConfig} from "pg";
import {Request, Response, NextFunction} from "express";
import {RouteData, RouteDirectionData} from "./types";

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

type ExpressCallback<B, U, L, L_> = (req: Request<B, U, L, L_>, res: Response, next: NextFunction) => void;
export function databaseErrorHandler<ReqParams = Record<string, any>, _ = any, ReqBody = Record<string, any>, Query = Record<string, any>>(callback: ExpressCallback<ReqParams, _, ReqBody, Query>): ExpressCallback<ReqParams, _, ReqBody, Query>{
    // Checks for database errors within a callback function and sends an internal server error response if one occurs
    return (req: Request<ReqParams, _, ReqBody, Query>, res: Response, next: NextFunction) => {
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
    },
    getRoutes: async (search: string) => {
        const values = [`%${search}%`];
        const query = `SELECT route_id, route_short_name, route_long_name FROM routes WHERE route_short_name LIKE $1`;
        return (await pool.query<RouteData, typeof values>(query, values)).rows;
    },
    getRouteDirections: async (route_id: number) => {
        const values = [route_id];
        const query = `
        WITH counts AS (
            SELECT trips.direction_id, trips.trip_headsign, COUNT(trips.trip_headsign) AS trip_count
            FROM routes, trips WHERE routes.route_id = $1 AND routes.route_id = trips.route_id
            GROUP BY (trips.direction_id, trips.trip_headsign)
        )
        SELECT direction_id, trip_headsign FROM counts ORDER BY direction_id, trip_count DESC;`;
        return (await pool.query<RouteDirectionData, typeof values>(query, values)).rows;
    }
};

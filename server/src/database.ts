import {Pool, PoolConfig} from "pg";
import {Request, Response, NextFunction} from "express";
import {RouteData, RouteDirectionData, StopListData, TripData, StopTimesOptions, StopTimesData} from "./types";

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
        return (await pool.query<RouteData>(query, values)).rows;
    },
    getRouteDirections: async (route_short_name: string) => {
        const values = [route_short_name];
        const query = `
        WITH counts AS (
            SELECT trips.direction_id, trips.trip_headsign, COUNT(trips.trip_headsign) AS trip_count
            FROM routes, trips
            WHERE routes.route_id = trips.route_id AND routes.route_short_name = $1
            GROUP BY (trips.direction_id, trips.trip_headsign)
        )
        SELECT direction_id, trip_headsign FROM counts ORDER BY direction_id, trip_count DESC;`;
        return (await pool.query<RouteDirectionData>(query, values)).rows;
    },
    getStops: async (route_short_name: string, service_id: number, direction_id: number) => {
        const values = [route_short_name, service_id, direction_id];
        const query = `
        WITH route_stops AS (
            SELECT times.stop_id, MAX(times.stop_sequence) AS stop_sequence
            FROM routes, trips, times
            WHERE routes.route_id = trips.route_id AND trips.trip_id = times.trip_id AND routes.route_short_name = $1 AND trips.service_id = $2 AND trips.direction_id = $3
            GROUP BY times.stop_id
        )
        SELECT stops.stop_id, stops.stop_code, stops.stop_name FROM route_stops, stops WHERE route_stops.stop_id = stops.stop_id ORDER BY route_stops.stop_sequence;`
        return (await pool.query<StopListData>(query, values)).rows;
    },
    getTrip: async (trip_id: number) => {
        const values = [trip_id];
        const query = `
        SELECT stops.stop_code, stops.stop_name, times.arrival_time, times.departure_time
        FROM stops, times
        WHERE times.trip_id = $1 AND stops.stop_id = times.stop_id ORDER BY times.stop_sequence;`;
        return (await pool.query<TripData>(query, values)).rows;
    },
    getStopTimes: async (options: StopTimesOptions) => {
        const values = Object.values(options);
        if (values.length !== 7){
            throw new Error("Incorrect number of options given.");
        }
        const query = `
        WITH trip_times AS (
            SELECT trips.trip_id, trips.trip_headsign, times.arrival_time, times.departure_time
            FROM routes, trips, stops, times
            WHERE routes.route_id = trips.route_id AND trips.trip_id = times.trip_id AND stops.stop_id = times.stop_id AND
                routes.route_short_name = $1 AND trips.service_id = $2 AND trips.direction_id = $3 AND (stops.stop_code = $4 OR stops.stop_code = $5) AND times.departure_time >= $6
        ),
        valid_trips AS (
            SELECT trip_id, MIN(departure_time) AS start_time
            FROM trip_times
            GROUP BY (trip_id) HAVING COUNT(*) = 2 ORDER BY start_time LIMIT $7
        )
        SELECT valid_trips.trip_id, trip_times.trip_headsign, trip_times.arrival_time, trip_times.departure_time
        FROM trip_times, valid_trips
        WHERE valid_trips.trip_id = trip_times.trip_id ORDER BY trip_times.trip_id, trip_times.departure_time;`;
        return (await pool.query<StopTimesData>(query, values)).rows;
    }
};

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
        const tables = [
            `CREATE TABLE IF NOT EXISTS temp (id SERIAL PRIMARY KEY);`,
            `CREATE TABLE IF NOT EXISTS routes (route_id INTEGER PRIMARY KEY, route_short_name VARCHAR(10), route_long_name VARCHAR(255));`,
            `CREATE TABLE IF NOT EXISTS trips (trip_id INTEGER PRIMARY KEY, route_id INTEGER, service_id INTEGER, trip_headsign VARCHAR(255), direction_id INTEGER, block_id INTEGER);`,
            `CREATE TABLE IF NOT EXISTS stops (stop_id INTEGER PRIMARY KEY, stop_code VARCHAR(10), stop_name VARCHAR(255), stop_lat DOUBLE PRECISION, stop_lon DOUBLE PRECISION);`,
            `CREATE TABLE IF NOT EXISTS times (time_id BIGSERIAL PRIMARY KEY, trip_id INTEGER, stop_id INTEGER, arrival_time INTEGER, departure_time INTEGER, stop_sequence INTEGER);`,
            `CREATE TABLE IF NOT EXISTS service (service_id BIGSERIAL PRIMARY KEY, service_number INTEGER, service_date DATE);`,
            `CREATE INDEX IF NOT EXISTS trips_bull ON trips(route_id, service_id, trip_headsign, direction_id, block_id);`,
            `CREATE INDEX IF NOT EXISTS stops_bull ON stops(stop_code, stop_name, stop_lat, stop_lon);`,
            `CREATE INDEX IF NOT EXISTS times_bull ON times(trip_id, stop_id, arrival_time, departure_time, stop_sequence);`,
            `CREATE INDEX IF NOT EXISTS service_bull ON service(service_number, service_date)`
        ];
        await Promise.all(tables.map((value) => pool.query(value)));
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

export const queries = {
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
    getStops: async (route_short_name: string, service_id: number, service_date: string, direction_id: number) => {
        const values = [route_short_name, service_id, service_date, direction_id];
        const query = `
        WITH route_stops AS (
            SELECT times.stop_id, MAX(times.stop_sequence) AS stop_sequence
            FROM routes, trips, times
            WHERE routes.route_id = trips.route_id AND trips.trip_id = times.trip_id AND routes.route_short_name = $1 AND
            (trips.service_id = $2 OR trips.service_id IN (SELECT service_number FROM service WHERE service_date = $3)) AND trips.direction_id = $4
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
        if (values.length !== 8){
            throw new Error("Incorrect number of options given.");
        }
        const query = `
        WITH trip_times AS (
            SELECT trips.trip_id, trips.trip_headsign, times.arrival_time, times.departure_time
            FROM routes, trips, stops, times
            WHERE routes.route_id = trips.route_id AND trips.trip_id = times.trip_id AND stops.stop_id = times.stop_id AND
                routes.route_short_name = $1 AND (trips.service_id = $2 OR trips.service_id IN (SELECT service_number FROM service WHERE service_date = $3)) AND
                trips.direction_id = $4 AND (stops.stop_code = $5 OR stops.stop_code = $6) AND times.departure_time >= $7
        ),
        valid_trips AS (
            SELECT trip_id, MIN(departure_time) AS start_time
            FROM trip_times
            GROUP BY (trip_id) HAVING COUNT(*) = 2 ORDER BY start_time LIMIT $8
        )
        SELECT valid_trips.trip_id, trip_times.trip_headsign, trip_times.arrival_time, trip_times.departure_time
        FROM trip_times, valid_trips
        WHERE valid_trips.trip_id = trip_times.trip_id ORDER BY trip_times.trip_id, trip_times.departure_time;`;
        const rows = (await pool.query<StopTimesData>(query, values)).rows;

        if (rows.length % 2 !== 0){
            // The query results should have two elements for each trip so if the length is not even, there was an error somewhere
            throw new Error("Error getting stop times.");
        }
        return rows;
    }
};

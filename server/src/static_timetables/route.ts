import express from "express";
import {databaseErrorHandler, queries} from "../database";
import {readDate} from "./helpers";
import {Empty} from "../types";

type RouteSearchQuery = {
    date: string;
    direction: string;
};
type TimesSearchBody = {
    date: string;
    direction: number;
    start: string;
    end: string;
    prevTimes: number[];
}

const skytrainMatch = new RegExp(/@ Platform \d+/);
const wceMatch = new RegExp(/Station (?:West|East)bound/);

const router = express.Router();

router.get("/routes", databaseErrorHandler<Empty, Empty, Empty, {route: string}>(async (req, res) => {
    let search = "";
    if (typeof req.query.route === "string"){
        search = req.query.route;
    }

    const results = await queries.getRoutes(search);
    const routes = results.map((value) => ({name: value.route_short_name, destinations: value.route_long_name}));
    return res.json(routes);
}));

router.get("/routes/:route", databaseErrorHandler<{route: string}>(async (req, res) => {
    const routeName = req.params.route;
    if (typeof routeName !== "string"){
        return res.status(400).send("Invalid route name.");
    }

    const results = await queries.getRouteDirections(routeName);
    return res.json(results);
}));

router.get("/routes/:route/stops", databaseErrorHandler<{route: string}, Empty, Empty, RouteSearchQuery>(async (req, res) => {
    const routeName = req.params.route;
    const date = req.query.date;
    const direction = parseInt(req.query.direction);
    if (typeof routeName !== "string"){
        return res.status(400).send("Invalid route name.");
    }
    if (isNaN(direction)){
        return res.status(400).send("Invalid direction provided.");
    }

    const [serviceDate, service] = readDate(date, new Date());

    const results = await queries.getStops(routeName, service, serviceDate, direction);
    return res.json(results);
}));

router.post("/routes/:route/times", databaseErrorHandler<{route: string}, Empty, TimesSearchBody>(async (req, res) => {
    const routeName = req.params.route;
    const date = req.body.date;
    const direction = req.body.direction;
    const startStop = req.body.start;
    const endStop = req.body.end;
    if (typeof routeName !== "string"){
        return res.status(400).send("Invalid route name.");
    }
    if (isNaN(direction)){
        return res.status(400).send("Invalid direction.");
    }
    // startStop and endStop are both different stop codes
    if (typeof startStop !== "string" || typeof endStop !== "string"){
        return res.status(400).send("Must provide a start and end stop.");
    }
    if (startStop === endStop){
        return res.status(400).send("Start and end stop must be different.");
    }

    // The user can pass in an array of previous times that are the arrival times of the previous route's trips
    // Then, this function will return only those trips that depart after those arrival times. This allows getting static timetables when transferring between multiple routes.
    // If the user does not pass in this array, it will use the current time as the default start time
    const t = new Date();
    let prevTimes: number[] = [t.getHours() * 3600 + t.getMinutes() * 60 + t.getSeconds()];
    const [serviceDate, service] = readDate(date, t);
    if (Array.isArray(req.body.prevTimes) && req.body.prevTimes.length >= 1){
        prevTimes = req.body.prevTimes.filter((value) => typeof value === "number");
    }

    const results = await queries.getStopTimes({
        route_short_name: routeName,
        service_id: service,
        service_date: serviceDate,
        direction_id: direction,
        startStop: startStop,
        endStop: endStop,
        afterTime: prevTimes[0]
    });
    if (results.length === 0){
        // No results mean one of the search options was incorrect
        return res.status(404).send("No stop times matched the search options.");
    }

    // Group results by trip id and set the start time to the departure time from the start stop and end time to the arrival time from the end stop
    let i = 0;// Index in prevTimes
    const times: {trip_id: number; trip_headsign: string; startTime: number; endTime: number;}[] = [];
    for (let x = 0; x < results.length; x += 2){
        if (results[x].trip_id === results[x + 1].trip_id){
            times.push({
                trip_id: results[x].trip_id,
                trip_headsign: results[x].trip_headsign,
                startTime: results[x].departure_time,
                endTime: results[x + 1].arrival_time
            });
        }
    }
    // This is the list of all times for the entire day, sorted by departure time from the start stop
    times.sort((a, b) => a.startTime - b.startTime);

    // Only keep the times that match each element in prevTimes. The resulting array should have the same length as prevTimes unless there are not enough trips left in the day that some transfers specified in prevTimes are not possible.
    const transferTimes: typeof times = [];
    let x = 0;
    while (x < times.length && transferTimes.length < prevTimes.length){
        if (times[x].startTime >= prevTimes[i]){
            // Find the earliest time after the current element in prevTimes. When found, advance to the next element in prevTimes.
            transferTimes.push(times[x]);
            i = Math.min(i + 1, prevTimes.length - 1);
        } else{
            // Only advance to the next trip time if it does not match the current element in prevTimes. This is because one trip may match multiple elements in prevTimes.
            x++;
        }
    }

    return res.json(transferTimes);
}));

router.get("/trips/:trip", databaseErrorHandler<{trip: string}>(async (req, res) => {
    const tripid = parseInt(req.params.trip);
    if (isNaN(tripid)){
        return res.status(400).send("Invalid trip ID.");
    }

    const trip = await queries.getTrip(tripid);

    if (trip.length === 0){
        return res.status(404).send("Trip not found.");
    }

    return res.json(trip);
}));

router.get("/stops", databaseErrorHandler(async (req, res) => {
    const stops = await queries.getAllStops();

    // Filter out skytrain and west coast express
    const filtered = stops.filter((value) => value.stop_name.match(skytrainMatch) === null && value.stop_name.match(wceMatch) === null);
    res.json(filtered);
}));

export default router;

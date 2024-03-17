import express from "express";
import {databaseErrorHandler, helpers} from "../database";
import {Empty} from "../types";

const router = express.Router();

router.get("/routes", databaseErrorHandler<Empty, Empty, Empty, {route: string}>(async (req, res) => {
    const search = req.query.route;
    if (typeof search !== "string"){
        return res.json([]);
    }

    const results = await helpers.getRoutes(search);
    const routes = results.map((value) => ({name: value.route_short_name, destinations: value.route_long_name}));
    return res.json(routes);
}));

router.get("/routes/:route", databaseErrorHandler<{route: string}>(async (req, res) => {
    const routeName = req.params.route;
    if (typeof routeName !== "string"){
        return res.status(400).send("Invalid route name.");
    }

    const results = await helpers.getRouteDirections(routeName);
    return res.json(results);
}));

router.get("/routes/:route/stops", databaseErrorHandler<{route: string}, Empty, Empty, {service: string; direction: string;}>(async (req, res) => {
    const routeName = req.params.route;
    const service = parseInt(req.query.service);
    const direction = parseInt(req.query.direction);
    if (typeof routeName !== "string"){
        return res.status(400).send("Invalid route name.");
    }
    for (const x of [service, direction]){
        if (isNaN(x)){
            return res.status(400).send("Invalid search options provided.");
        }
    }

    const results = await helpers.getStops(routeName, service, direction);
    return res.json(results);
}));

router.get("/trips/:trip", databaseErrorHandler<{trip: string}>(async (req, res) => {
    const tripid = parseInt(req.params.trip);
    if (isNaN(tripid)){
        return res.status(400).send("Invalid trip ID.");
    }

    const trip = await helpers.getTrip(tripid);

    if (trip.length === 0){
        return res.status(404).send("Trip not found.");
    }

    return res.json(trip);
}));

export default router;

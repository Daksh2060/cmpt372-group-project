import express from "express";
import {databaseErrorHandler, helpers} from "../database";
import {Empty} from "../types";

const router = express.Router();

router.get("/routes/search", databaseErrorHandler<Empty, Empty, Empty, {route: string}>(async (req, res) => {
    const search = req.query.route;
    if (typeof search !== "string"){
        return res.json([]);
    }

    const results = await helpers.getRoutes(search);
    const routes = results.map((value) => ({route_id: value.route_id, displayName: `${value.route_short_name} ${value.route_long_name}`}));
    return res.json(routes);
}));

router.get("/routes/:route", databaseErrorHandler<{route: string}>(async (req, res) => {
    const routeid = parseInt(req.params.route);
    if (typeof routeid !== "number" || isNaN(routeid)){
        return res.status(400).send("Invalid route ID.");
    }

    const results = await helpers.getRouteDirections(routeid);
    return res.json(results);
}));

export default router;

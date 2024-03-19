import express from "express";
import {databaseErrorHandler, queries} from "../database";
import {A} from "./helpers";
import {Empty} from "../types";

const router = express.Router();

router.get("/realtime", databaseErrorHandler(async (req, res) => {
    const x = A;
    res.json({});
}));

export default router;

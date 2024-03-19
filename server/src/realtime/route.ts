import express from "express";
import {databaseErrorHandler, helpers} from "../database";
import {Empty} from "../types";

const router = express.Router();

router.get("/realtime", databaseErrorHandler(async (req, res) => {
    res.json({});
}));

export default router;

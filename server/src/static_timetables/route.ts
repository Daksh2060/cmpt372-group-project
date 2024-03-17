import express from "express";
import {databaseErrorHandler, helpers} from "../database";
import {Empty} from "../types";

const router = express.Router();

router.get<Empty, Empty, never>("/routes", databaseErrorHandler<never>(async (req, res) => {
    const results = await helpers.test();
    res.json(results);
}));

export default router;

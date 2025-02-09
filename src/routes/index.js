import express from "express";
import identifyRoutes from "./identify.js";

const router = express.Router();

router.use("/identify", identifyRoutes);

export default router;

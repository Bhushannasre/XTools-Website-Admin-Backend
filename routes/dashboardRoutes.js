import express from "express";
import { getDashboardStats, getDashboardGraphData } from "../controller/dashboardController.js";
import { requireAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/stats", requireAdmin, getDashboardStats);
router.get("/graph", requireAdmin, getDashboardGraphData);

export default router;

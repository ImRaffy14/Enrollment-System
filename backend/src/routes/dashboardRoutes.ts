import express from "express";
import {
  getDashboardStats,
  getRecentApplications,
  getUpcomingEvents
} from "../controllers/dashboardController";

const router = express.Router();

router.get("/stats", getDashboardStats);
router.get("/recent-applications", getRecentApplications);
router.get("/upcoming-events", getUpcomingEvents);

export default router;
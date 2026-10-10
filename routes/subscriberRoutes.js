import express from "express";
import {
  getSubscribers,
  updateSubscriberStatus,
  deleteSubscriber,
} from "../controller/subscriberController.js";
import { requireAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/subscribers", requireAdmin, getSubscribers);
router.patch("/subscribers/:id", requireAdmin, updateSubscriberStatus);
router.delete("/subscribers/:id", requireAdmin, deleteSubscriber);

export default router;

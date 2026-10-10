import express from "express";
import { getUsers, deleteUser } from "../controller/userController.js";
import { requireAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/users", requireAdmin, getUsers);
router.delete("/users/:id", requireAdmin, deleteUser);

export default router;
import express from "express";
import {
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
} from "../controller/contactController.js";
import { requireAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/contacts", requireAdmin, getContacts);
router.get("/contacts/:id", requireAdmin, getContactById);
router.put("/contacts/:id", requireAdmin, updateContact);
router.delete("/contacts/:id", requireAdmin, deleteContact);

export default router;

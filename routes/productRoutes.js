import express from "express";
import { requireAdmin } from "../middleware/adminMiddleware.js";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controller/productController.js";

const router = express.Router();

router.use(requireAdmin);
router.get("/products", getProducts);
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

export default router;

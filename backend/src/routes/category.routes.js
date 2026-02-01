import { Router } from "express";
import { createCategory, getAllCategories } from "../controllers/category.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";


const router = Router();

// ✅ public
router.get("/", getAllCategories);

// ✅ protected (only logged-in users)
router.post("/", verifyJWT, verifyAdmin, createCategory);

export default router;

import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";
import {
  createTopic,
  getTopicsByCategory,
  getTopicById,
  updateTopic,
  deleteTopic,
} from "../controllers/topic.controller.js";

const router = Router();

// ✅ CREATE topic (Admin only)
router.post("/", verifyJWT, verifyAdmin, createTopic);

// ✅ GET topics by category (Public)
router.get("/category/:categoryId", getTopicsByCategory);

// ✅ GET single topic by ID (Public)
router.get("/:topicId", getTopicById);

// ✅ UPDATE topic (Admin only)
router.put("/:topicId", verifyJWT, verifyAdmin, updateTopic);

// ✅ DELETE topic (Admin only)
router.delete("/:topicId", verifyJWT, verifyAdmin, deleteTopic);

export default router;

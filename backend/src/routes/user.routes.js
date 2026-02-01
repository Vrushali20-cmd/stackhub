import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// ✅ Protected route
router.get("/me", verifyJWT, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "You are authorized ✅",
    user: req.user,
  });
});

export default router;

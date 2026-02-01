import { Router } from "express";
import { registerUser,loginUser } from "../controllers/auth.controller.js";
import { refreshAccessToken } from "../controllers/auth.refresh.controller.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);


export default router;

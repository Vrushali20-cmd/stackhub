import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = async (req, res, next) => {
  try {
    // 1️⃣ Get token from cookie OR Authorization header
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - token missing",
      });
    }

    // 2️⃣ Verify access token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // 3️⃣ Fetch user from DB (IMPORTANT: include role)
    const user = await User.findById(decoded._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - user not found",
      });
    }

    // 4️⃣ Attach user to request
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - invalid or expired token",
      error: error.message,
    });
  }
};

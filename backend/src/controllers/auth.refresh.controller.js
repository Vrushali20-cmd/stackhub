import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { generateAccessToken } from "../utils/generateTokens.js";

export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken =
      req.cookies?.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token missing",
      });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decoded._id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    const newAccessToken = generateAccessToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Access token refreshed ✅",
      accessToken: newAccessToken,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Refresh token expired or invalid",
    });
  }
};

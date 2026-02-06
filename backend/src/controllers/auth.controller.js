import { User } from "../models/user.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // ✅ basic validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ✅ check if user already exists
    const existedUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existedUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // ✅ create user
    const user = await User.create({
      username,
      email,
      password,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully ✅",
      user: {
       _id: user._id,
       username: user.username,
       email: user.email,
       role: user.role, 
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Register failed ❌",
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isValid = await user.isPasswordCorrect(password);
    if (!isValid) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // ✅ store refresh token in DB
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // ✅ cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: false, // true when HTTPS in production
      sameSite: "lax",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json({
        success: true,
        message: "Login successful ✅",
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
        },
        accessToken,
        refreshToken,
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

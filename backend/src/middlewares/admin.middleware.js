export const verifyAdmin = (req, res, next) => {
  // req.user is already set by verifyJWT
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access only ❌",
    });
  }

  next();
};

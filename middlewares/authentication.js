const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const { AppError } = require("../helpers/utils.helper");
const authMiddleware = {};
const User = require("../models/user");

authMiddleware.loginRequired = (req, res, next) => {
  try {
    const tokenString = req.headers.authorization;
    if (!tokenString)
      return next(new AppError(401, "Login required", "Validation Error"));
    const token = tokenString.replace("Bearer ", "");
    jwt.verify(token, JWT_SECRET_KEY, (err, payload) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return next(new AppError(401, "Token expired", "Validation Error"));
        } else {
          return next(
            new AppError(401, "Token is invalid", "Validation Error")
          );
        }
      }
      // console.log(payload);
      req.userId = payload._id;
    });
    next();
  } catch (error) {
    next(error);
  }
};

authMiddleware.isManagerOrAdmin = async (req, res, next) => {
  try {
    let user = await User.findById(req.userId);
    if (!user) {
      return next(new AppError(400, "User Not Found!", "Auth Error"));
    }
    console.log(user.userRole);
    if (user.userRole !== "owner" && user.userRole !== "manager") {
      return next(new AppError(403, "Unauthorized Access!", "Auth Error"));
    }
    req.role = user.userRole;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authMiddleware;

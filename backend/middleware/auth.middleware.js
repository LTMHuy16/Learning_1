const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const User = require("../models/user.model");

const authMiddleware = async (req, res, next) => {
  try {
    let token = req.headers?.authorization.toString();
    if (!token || !token.startsWith("Bearer")) throw new Error("There is no token attached.");

    token = token.split(" ")[1];
    if (!token) throw new Error("Invalid token.");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded?.id);

    if (user) {
      req.user = user;
      next();
    } else {
      res.status(401);
      throw new Error("Not user found with authentication id.");
    }
  } catch (error) {
    next(error);
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const { user } = req;

    if (!user || !user.role || user.role != "admin") {
      res.status(401);
      throw new Error("You must be admin to access this resources.");
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { authMiddleware, isAdmin };

const express = require("express");
const router = express.Router();
const { createUser, loginUser, getAllUser, getSingleUser, deleteUser, updateUser } = require("../controllers/user.controller");
const { authMiddleware } = require("../middleware/auth.middleware");

router.post("/register", createUser);

router.post("/login", loginUser);

router.get("/all", getAllUser);

router.get("/:id", authMiddleware, getSingleUser);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

module.exports = router;

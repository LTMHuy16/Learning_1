const express = require("express");
const router = express.Router();
const { createUser, loginUser, getAllUser, getSingleUser, deleteUser, updateUser, blockUser, unBlockUser, handleRefreshToken, userLogout, updatePassword } = require("../controllers/user.controller");
const { authMiddleware, isAdmin } = require("../middleware/auth.middleware");

router.post("/register", createUser);

router.post("/login", loginUser);

router.get("/all", getAllUser);

router.put("/block/:id", authMiddleware, blockUser);

router.put("/unblock/:id", authMiddleware, unBlockUser);

router.get("/refresh_token", handleRefreshToken);

router.put("/update_password", authMiddleware, updatePassword);

router.get("/logout", userLogout);

router.get("/:id", authMiddleware, isAdmin, getSingleUser);

router.put("/:id", authMiddleware, updateUser);

router.delete("/:id", authMiddleware, deleteUser);

module.exports = router;

const express = require("express");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middleware/auth.middleware");
const { createProduct, getProduct, getAllProduct, updateProduct, deleteProduct } = require("../controllers/product.controller");

router.post("/create", authMiddleware, isAdmin, createProduct);

router.get("/all", authMiddleware, isAdmin, getAllProduct);

router.get("/:id", authMiddleware, isAdmin, getProduct);

router.put("/:id", authMiddleware, isAdmin, updateProduct);

router.delete("/:id", authMiddleware, isAdmin, deleteProduct);

module.exports = router;

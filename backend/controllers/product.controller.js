const Product = require("../models/product.model");

const createProduct = async (req, res, next) => {
  try {
    const newProduct = await Product.create({ ...req.body });
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    if (!req.params.id) throw new Error("Product Id is required in params.");

    const findProduct = await Product.findById(req.params.id);
    if (!findProduct) throw new Error("Can not found product.");

    res.status(200).json(findProduct);
  } catch (error) {
    next(error);
  }
};

const getAllProduct = async (req, res, next) => {
  try {
    // Filtering
    const queryObj = { ...req.query };

    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((field) => delete queryObj[field]);

    let queryString = JSON.stringify(queryObj).replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Product.find(JSON.parse(queryString));
    if (!query) throw new Error("Can not found product.");

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else query = query.sort("-createdAt");

    // Limiting fields
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else query = query.select("-__v");

    // Pagination
    const page = req.query.page || 1,
      limit = req.query.limit || 20,
      skip = (page - 1) * limit;

    const productCount = await Product.countDocuments();
    if (skip >= productCount) throw new Error("This page does not exist.");

    query = query.skip(skip).limit(limit);

    const products = await query;

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    if (!req.params.id) throw new Error("Product Id is required in params.");

    const updateProduct = await Product.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true });

    if (!updateProduct) throw new Error("Can not update this product.");

    res.status(201).json(updateProduct);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    if (!req.params.id) throw new Error("Product Id is required in params.");

    const deletedProduct = await Product.findByIdAndDelete(req.params.id, { new: true });

    if (!deletedProduct) throw new Error("Can not remove this product.");

    res.status(201).json(deletedProduct);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  getProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
};

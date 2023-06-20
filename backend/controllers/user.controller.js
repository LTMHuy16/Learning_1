const { generateToken } = require("../config/JWT");
const User = require("../models/user.model");

const createUser = async (req, res, next) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email });

    if (!user) {
      // CREATE NEW USER
      const newUser = await User.create(req.body);
      if (!newUser) throw Error("Can't not create new user.");
      res.status(201).json({ user: newUser });
    } else res.json({ message: "User already exist.", success: false });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const findUser = await User.findOne({ email });
    if (!findUser) throw new Error("Can't not found user.");

    const isMatchedPass = await findUser.isPasswordMatched(password);
    if (!isMatchedPass) throw new Error("Password is not correctly.");

    res.status(200).json({ user: { ...findUser._doc, token: generateToken(findUser._id) }, success: true });
  } catch (error) {
    next(error);
  }
};

const getAllUser = async (req, res, next) => {
  try {
    const allUsers = await User.find({});

    res.status(200).json({ users: allUsers, success: true });
  } catch (error) {
    next(error);
  }
};

const getSingleUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const findUser = await User.findById(id);
    if (!findUser) throw new Error("Can't not found user.");

    res.status(200).json({ user: findUser, success: true });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const findUser = await User.findByIdAndUpdate(id, { ...req.body }, { new: true });
    if (!findUser) throw new Error("Can't not found user.");

    res.status(200).json({ user: findUser, success: true });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndRemove(id);
    if (!deletedUser) throw new Error("Can't not found user.");

    res.status(200).json({ user: deletedUser, success: true });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  loginUser,
  getAllUser,
  getSingleUser,
  updateUser,
  deleteUser,
};

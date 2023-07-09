const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { generateToken } = require("../config/JWT");
const { validatorMongoId } = require("../validators/mongoId.validator");
const { generateRefreshToken } = require("../config/refreshToken");
const { VARIABLES } = require("../utils/globalVariables");

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

    const refreshToken = generateRefreshToken(findUser._id);
    const updateUser = await User.findByIdAndUpdate(findUser._id, { refreshToken }, { new: true });
    if (!updateUser) throw new Error("Can't not create refresh token.");

    res.cookie(VARIABLES.refreshToken, refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ user: { ...updateUser._doc, token: generateToken(findUser._id) }, success: true });
  } catch (error) {
    next(error);
  }
};

const handleRefreshToken = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    if (!cookies[VARIABLES.refreshToken]) throw new Error("No refresh token in cookie.");
    const refreshToken = cookies[VARIABLES.refreshToken];

    const user = await User.findOne({ refreshToken });
    if (!user) throw new Error("Can't found user with this refresh token.");

    jwt.verify(refreshToken, process.env.JWT_SECRET, (error, decoded) => {
      if (error || user._id != decoded.id) throw new Error("Some thing went wrong verify user information.");
    });

    const accessToken = generateToken(user._id);

    res.status(200).json({ accessToken });
  } catch (error) {
    next(error);
  }
};

const userLogout = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    if (!cookies[VARIABLES.refreshToken]) throw new Error("No refresh token in cookie.");
    const refreshToken = cookies[VARIABLES.refreshToken];

    const user = await User.findOne({ refreshToken });
    if (!user) throw new Error("Can't found user with this refresh token.");

    if (user) {
      const clearTokenUser = await User.findOneAndUpdate({ refreshToken, _id: user._id }, { refreshToken: "" });
      if (!clearTokenUser) throw new Error("Can't not update refreshToken.");
    }

    res.clearCookie(VARIABLES.refreshToken, { httpOnly: true, secure: true });
    res.sendStatus(204);
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

    validatorMongoId(id);

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

    validatorMongoId(id);

    const findUser = await User.findByIdAndUpdate(id, { ...req.body }, { new: true });
    if (!findUser) throw new Error("Can't not found user.");

    res.status(200).json({ user: findUser, success: true });
  } catch (error) {
    next(error);
  }
};

const blockUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    validatorMongoId(id);

    const findUser = await User.findByIdAndUpdate(id, { isBlocked: true }, { new: true });
    if (!findUser) throw new Error("Can't not found user.");

    res.status(200).json({ user: findUser, success: true });
  } catch (error) {
    next(error);
  }
};

const unBlockUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    validatorMongoId(id);

    const findUser = await User.findByIdAndUpdate(id, { isBlocked: false }, { new: true });
    if (!findUser) throw new Error("Can't not found user.");

    res.status(200).json({ user: findUser, success: true });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    validatorMongoId(id);

    const deletedUser = await User.findByIdAndRemove(id);
    if (!deletedUser) throw new Error("Can't not found user.");

    res.status(200).json({ user: deletedUser, success: true });
  } catch (error) {
    next(error);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const { _id, password } = req.body;

    if (!password) throw new Error("Password is required.");
    if (!_id) throw new Error("User Id is required.");

    validatorMongoId(_id);

    const user = await User.findById(_id);
    if (!user) throw new Error("Can not find user.");

    user.password = password;
    const updatedUser = await user.save();
    if (!updateUser) throw new Error("Can not update user");

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  loginUser,
  getAllUser,
  getSingleUser,
  handleRefreshToken,
  blockUser,
  unBlockUser,
  updateUser,
  deleteUser,
  userLogout,
  updatePassword,
};

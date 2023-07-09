const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: String,
    },
    role: {
      type: String,
      default: "user",
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    wishlist: {
      type: Array,
      default: [],
    },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    refreshToken: {
      type: String,
    },
    passwordChangedAt: {
      type: Date,
      default: Date.now(),
    },
    passwordResetToken: String,
    passwordResetExpire: Date,
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();

  this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.isPasswordMatched = async function (enterPassword) {
  return await bcrypt.compare(enterPassword, this.password);
};

UserSchema.methods.createPasswordResetToken = async function (enterPassword) {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.passwordResetExpire = Date.now() + 30 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", UserSchema);

// {
//   "firstName": "Le",
//   "lastName": "Huy",
//   "email": "ltmh16@gmail.com",
//   "mobile": "0905330123",
//   "password": "Minhhuy09"
// }

const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGOOSE_DB_URL);
  } catch (error) {
    throw new Error(error._message || error.message);
  }
};

module.exports = { dbConnect };

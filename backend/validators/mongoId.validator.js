const mongoose = require("mongoose");

const validatorMongoId = (id) => {
  const isValidMongoId = mongoose.Types.ObjectId.isValid(id);
  if (!isValidMongoId) throw new Error("This is not valid id.");
};

module.exports = { validatorMongoId };

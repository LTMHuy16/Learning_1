const notFoundRouter = (req, res, next) => {
  const error = new Error(`Not Found ${req.path}`);
  res.status(404).json({ message: error.message });
};

const errorHandlerRouter = (error, req, res, next) => {
  if (!error) return;

  const statuscode = res.statusCode == 200 ? 500 : res.statusCode;

  res.status(statuscode).json({
    success: false,
    message: error?.message,
    stack: error?.stack,
  });
};

module.exports = { notFoundRouter, errorHandlerRouter };

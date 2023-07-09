const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { dbConnect } = require("./config/dbConnect");
const { notFoundRouter, errorHandlerRouter } = require("./middleware/errorHandler.middleware");

const app = express();
const PORT = process.env.PORT || 4000;
const dotenv = require("dotenv").config();

// IMPORT ROUTERS
const userRouter = require("./routes/user.router");
const productRouter = require("./routes/product.router");

// CONFIG
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// ROUTES
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);

// NOT FOUND ROUTE
app.use(notFoundRouter);

// ERROR HANDLER ROUTE
app.use(errorHandlerRouter);

// START SERVER
dbConnect();

app.listen(PORT, () => {
  console.log(`Server is running in port ${PORT}`);
});

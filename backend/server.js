const express = require("express");
const { dbConnect } = require("./config/dbConnect");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 4000;

// IMPORT ROUTERS
const userRouter = require("./routes/user.router");
const bodyParser = require("body-parser");
const { notFoundRouter, errorHandlerRouter } = require("./middleware/errorHandler.middleware");

// CONFIG
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// ROUTES
app.use("/api/user", userRouter);

// NOT FOUND ROUTE
app.use(notFoundRouter);

// ERROR HANDLER ROUTE
app.use(errorHandlerRouter);

// START SERVER
dbConnect();

app.listen(PORT, () => {
  console.log(`Server is running in port ${PORT}`);
});

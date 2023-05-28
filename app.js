require("dotenv").config();
require("express-async-errors");
// Security
const helmet = require("helmet");
const cors = require("cors");
const xssClean = require("xss-clean");
const ratingLimit = require("express-rate-limit");
// Extension
const morgan = require("morgan");
const compression = require("compression");
const cookieParser = require("cookie-parser");
// Normal
const express = require("express");
const app = express();
const notFound = require("./src/middleware/not-found");
const errorHandlerMiddleware = require("./src/middleware/error-handler");

// ------------ Middleware ------------
// Security
app.set("trust proxy", 1);
app.use(
  ratingLimit({
    windowMs: 15 * 60 * 100, // 15 Minute
    max: 100, // Limit each IP to 100 requests per windowMs
  })
);
app.use(cors());
app.use(helmet());
app.use(xssClean());

// Extension
app.use(cookieParser());
app.use(compression());
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./src/db/connectDB");
const { checkOverload } = require("./src/helpers/check-connect");
checkOverload();

app.use("/", require("./src/router"));

app.use(errorHandlerMiddleware);
app.use("/**", notFound);

module.exports = app;

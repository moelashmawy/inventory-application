const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const config = require("config");
// our routes
const productRouter = require("./routes/api/product");
const categoryRouter = require("./routes/api/category");
const usersRouter = require("./routes/api/users");

const app = express();

// for body-parser middleware
app.use(express.json());

// morgan logger for dev
app.use(logger("dev"));

//make our upload an accesable folder
app.use("/uploads", express.static("uploads"));

// Database uri
const dbURI = config.get("dbURI");

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

//test database connection
let db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Database connected succefully...");
});

// Set up our main routes
app.use("/api/product", productRouter);
app.use("/api/category", categoryRouter);
app.use("/api/users", usersRouter);

// serve static assets if in production
if (process.env.NODE_ENV == "production") {
  // set static folder
  app.use(express.static(path.join(__dirname, "views", "build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "build", "index.html"));
  });
}

// if the request passes all the middleware without a response
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

// for general error handling
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    message: error.response
  });
});

// App's connection port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is connected on port ${PORT}`);
});

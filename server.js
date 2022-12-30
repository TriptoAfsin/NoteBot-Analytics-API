require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");

//importing web routes
const initWebRoutes = require("./routes/web");
//importing api controller
const apiController = require("./controllers/apiController");

//port
const port = process.env.PORT;

const corsOpts = {
  origin: "*",

  methods: ["GET", "POST", "PUT", "DELETE", "HEAD"],

  allowedHeaders: ["Content-Type"],
};

//cors middleware
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
}, cors(corsOpts));

//init web routes
initWebRoutes(app);

app.listen(port, () => {
  console.log(`🔵 Listening on Port: ${port}`);
});

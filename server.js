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

//init web routes
initWebRoutes(app);

//cors middleware
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

app.listen(port, () => {
  console.log(`🔵 Listening on Port: ${port}`);
});

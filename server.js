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

const corsOpts = {
  origin: '*',

  methods: [
    'GET',
    'POST',
    'PUT',
    'DELETE',
    'HEAD'
  ],

  allowedHeaders: [
    'Content-Type',
  ],
};

//cors middleware
app.use(
  cors(corsOpts)
);

app.listen(port, () => {
  console.log(`🔵 Listening on Port: ${port}`);
});

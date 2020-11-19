const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userRoutes = require("./backend/routes/user");
const taskRoutes = require("./backend/routes/task");
const listRoutes = require("./backend/routes/list");
const friendsRoutes = require("./backend/routes/friends");

const cors = require("cors");
const passport = require("passport");

mongoose.set("useCreateIndex", true);
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);

mongoose
  .connect(
    "mongodb+srv://Muku_27:" +
      process.env.MONGODB_ATLAS_PWD +
      "@cluster0.isjwc.mongodb.net/to-do?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to Mongo Database");
  })
  .catch((error) => {
    console.log(error);
    console.log("Could not connect to Mongo Database");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );

  next();
});

app.options("*", cors());

require("./backend/authentication/jwt");
app.use(passport.initialize());

app.use("/api/user", userRoutes);
app.use(
  "/api/task",
  passport.authenticate("jwt", { session: false }),
  taskRoutes
);
app.use(
  "/api/list",
  passport.authenticate("jwt", { session: false }),
  listRoutes
);
app.use(
  "/api/friends",
  passport.authenticate("jwt", { session: false }),
  friendsRoutes
);

module.exports = app;

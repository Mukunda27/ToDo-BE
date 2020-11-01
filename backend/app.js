const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const passport = require("passport");

mongoose.set("useCreateIndex", true);
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);

mongoose
  .connect(
    "mongodb+srv://Muku_27:UxXMQDsPehagMrWh@cluster0.isjwc.mongodb.net/to-do?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to Mongo Database");
  })
  .catch(() => {
    console.log("Could not connect Mongo Database");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require("./authentication/jwt");
app.use(passport.initialize());

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

app.use("/api/user", userRoutes);

module.exports = app;

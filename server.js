const express = require("express");
const app = express();
const mongoose = require("mongoose");
const util = require("util");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");

// -- passport middleware
app.use(passport.initialize());

// -- passport Config
require("./config/passport.js")(passport);

// -- body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// -- Routes paths
const users = require("./router/api/users");
const profile = require("./router/api/profile");
const posts = require("./router/api/posts");

// -- Use routes for users, profile and posts
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

// -- server static assets if in production
if (process.env.NODE_ENV === "production") {
  // -- set static folder
  app.use(express.static("client/build"));

  // -- Load react index.html file
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// -- Server config
const port = process.env.PORT || 9090;

app.listen(port, () => {
  util.log("Server running on " + port);
});

// -- DB Config & Mongo DB Connection
const db = require("./config/keys").mongoURI;
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => {
    util.log("Mongo DB connected");
  })
  .catch(err => {
    util.log(err);
  });

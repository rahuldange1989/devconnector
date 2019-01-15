const express = require("express");
const app = express();
const mongoose = require("mongoose");
const util = require("util");

// -- Routes paths
const users = require("./router/api/users");
const profile = require("./router/api/profile");
const posts = require("./router/api/posts");

// -- Use routes for users, profile and posts
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

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

// -- Default server page
app.get("/", (req, res) => {
  res.send("Hello World");
});

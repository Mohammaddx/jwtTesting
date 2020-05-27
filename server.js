const express = require("express");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const app = express();
let secret = fs.readFileSync("secret.key");

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];
    req.token = token;
    next();
  } else {
    res.sendStatus(403);
  }
};

app.get("/api", (req, res) => {
  res.json({
    message: "Hello World!",
  });
});

app.post("/api/posts", verifyToken, (req, res) => {
  jwt.verify(req.token, secret, (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: "post created...",
        data,
      });
    }
  });
});

app.post("/api/login", (req, res) => {
  const user = {
    id: 1,
    username: "mohammaddx",
    password: "123456789",
  };

  jwt.sign({ user }, secret, (err, token) => {
    if (err) {
      res.json({
        message: "username or password not valid/correct",
      });
    } else {
      res.json({ token });
    }
  });
});

const posts = [
  { username: "mohammad", title: "post 1" },
  { username: "ahmad", title: "post 2" },
];
app.get("/posts", (req, res) => {
  res.json(posts);
});

app.listen(5000);

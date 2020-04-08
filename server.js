// imports express to run server
const express = require("express");

// imports posts-router as sub-router
const postsRouter = require("../data/posts-router");

// turns on the server
const server = express();

// first layer of middleware to parse incoming data into json
server.use(express.json());

// assigns incoming requests with /api/posts endpoints to posts-router.js
server.use("/api/posts", postsRouter);

// exports server to be used by index.js
module.exports = server;
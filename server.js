import express from "express";

const server = express();

server.get("/", (req, res) => {
  res.send("Welcome to Bitespeed");
});

let PORT = 3200;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

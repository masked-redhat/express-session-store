import express from "express";
import { server } from "./env/env.config.js";

const app = express();

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(server.port, server.host, () => {
  console.log("server started");
});

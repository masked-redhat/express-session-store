import express from "express";
import env from "./env/env.config.js";
import { shutdown } from "./utils/shutdown.js";
import { initialize } from "./utils/initialize.js";

const app = express();

app.get("/", (req, res) => {
  res.send("hello world");
});

const server = app.listen(env.server.port, env.server.host, () => {
  console.log("Server started");
});

initialize();

process.on("SIGINT", async () => {
  await shutdown(server);
});

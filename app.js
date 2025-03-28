import express from "express";
import env from "./env/env.config.js";
import { shutdown } from "./utils/shutdown.js";
import { initialize } from "./utils/initialize.js";
import { setSession, validate } from "./session.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Any body can see this");
});

app.get("/session", async (req, res) => {
  await setSession(req, res, "kartikey");
  res.send("session set");
});

app.get("/test", validate, (req, res) => {
  res.send("Only logged in can see this");
});

const server = app.listen(env.server.port, env.server.host, () => {
  console.log("Server started");
});

initialize();

process.on("SIGINT", async () => {
  await shutdown(server);
});

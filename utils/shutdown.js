import { closeRedis } from "../cache/close.js";

export const shutdown = async (server) => {
  console.log("Gracefully shutting down server");

  await closeRedis();
  console.log("Redis connection closed");

  server.close();
  console.log("Server closed");

  console.log("Shutdown complete!");
};

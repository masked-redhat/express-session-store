import { connectToRedis } from "../cache/connect.js";

export const initialize = async () => {
  await connectToRedis();
  console.log("Connected to Redis");
};

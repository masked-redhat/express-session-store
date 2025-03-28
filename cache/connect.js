import { createClient } from "redis";
import { redis } from "../env/env.config.js";

const client = createClient({ url: redis.url, database: redis.db });

export const connectToRedis = async (client_ = client) => {
  client_.on("error", (err) => {
    console.log(`Redis Error : ${err}`);
    console.log(err);
  });

  try {
    await client_.connect();
  } catch (err) {
    console.log(err);
  }
};

export default client;

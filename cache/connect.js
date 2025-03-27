import { createClient } from "redis";
import { redis } from "../env/env.config.js";

const client = createClient({ url: redis.url, database: redis.db });

client.on("error", (err) => {
  console.log(`Redis Error : ${err}`);
  console.log(err);
});

export const connectToRedis = async () => {
  try {
    await client.connect();
  } catch (err) {
    console.log(err);
  }
};

export default client;

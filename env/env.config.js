import dotenv from "dotenv";
import { isNumber } from "../utils/checks.js";

dotenv.config();

export const server = {
  host: process.env.host,
  port: process.env.port,
};

export const redis = {
  url: process.env.redis_url,
  db: isNumber(process.env.redis_db) ? process.env.redis_db : 1,
};

const env = { server, redis };

export default env;

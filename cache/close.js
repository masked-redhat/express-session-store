import client from "./connect.js";

export const closeRedis = async (client_ = client) => {
  try {
    await client_.disconnect();
  } catch (err) {
    console.log(err);
  }
};

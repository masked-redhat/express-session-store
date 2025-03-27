import client from "./connect.js";

export const closeRedis = async () => {
  try {
    await client.disconnect();
  } catch (err) {
    console.log(err);
  }
};

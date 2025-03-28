import client from "./cache/connect.js";
import session from "./middleware/session.js";

export const { setSession, validate } = session({
  secret: "secre",
  client: client,
  validateToNext: true,
  breakOnInValidate: true,
});

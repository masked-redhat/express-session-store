import types from "./constants/types.js";
import Session from "./services/session.js";

const session = ({
  secret,
  expiry = 24 * 60 * 60,
  client,
  type = types.STANDARD,
  breakOnInValidate = false,
  validateToNext = false,
  onInvalidate = () => {},
}) => {
  const ses = new Session(client, secret, expiry, type);

  const setSession = async (req, res, value) => {
    const sessionToken = await ses.initialize(value);
    res.cookie("session_m", sessionToken, { httpOnly: true });
    return sessionToken;
  };

  const validate = async (req, res = false, next = false) => {
    const token = req.cookies["session_m"];
    req.session = token;
    if ([null, undefined].includes(token)) {
      await onInvalidate(req, res);
      if (breakOnInValidate) {
        res.status(400).send("No session set");
        throw new Error("No session set");
      }
      return false;
    }

    const result = await ses.validate(token);
    if (!result.valid) {
      await onInvalidate(req, res);
      if (breakOnInValidate) {
        res.status(400).send("Session Expired");
        throw new Error("Session Expired");
      }
      return false;
    }

    if (validateToNext) {
      req.sessionValue = result.value;
      next();
    } else return result.value;
  };

  return { setSession, validate };
};

export const sessionTypes = types;

export default session;

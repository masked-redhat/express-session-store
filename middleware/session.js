import types from "../constants/types.js";
import { isValidJsonObject } from "../utils/checks.js";
import { uniqStr } from "../utils/utils.js";
import Tokens from "./tokens.js";

class Session {
  sessionSingleValue = { _module_sessionVar_singleValue: true };
  expiryInCacheIncrement = 60 * 60;

  constructor(client, secret, expiry, type) {
    this.client = client;
    this.type = type;
    this.expiry = expiry;
    this.tokens = new Tokens(secret, expiry);
  }

  initialize = async (value = {}) => {
    value = this.checkAndConvertSingleValue(value);

    if (this.type === types.STANDARD)
      return await this.initializeStandard(value);
    else if (this.type === types.INCREMENTAL)
      return await this.initializeIncremental(value);
  };

  initializeStandard = async (value) => {
    const jwtToken = this.tokens.createToken(value);
    const sessionToken = uniqStr();

    await this.client.setEx(
      sessionToken,
      this.expiry + this.expiryInCacheIncrement,
      jwtToken
    );
    return sessionToken;
  };

  initializeIncremental = async (value) => {};

  validate = async (sessionToken) => {
    const jwtToken = await this.client.get(sessionToken);
    if (jwtToken === null) return { valid: false };

    const result = this.tokens.validateToken(jwtToken);
    if (result === false) return { valid: false };

    const value = this.isSingleValue(result) ? result.value : result;

    return { valid: true, value };
  };

  convertToSingleValue = (value) => ({ value, ...this.sessionSingleValue });

  isSingleValue = (value) => {
    if (value[this.sessionSingleValue._module_sessionVar_singleValue] === true)
      return [true, value.value];
    return [false, value];
  };

  checkAndConvertSingleValue = (value) => {
    if (!isValidJsonObject(value)) value = this.convertToSingleValue(value);
    return value;
  };
}

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

export default session;

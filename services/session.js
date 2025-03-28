import types from "../constants/types.js";
import { uniqStr } from "../utils/utils.js";
import { isValidJsonObject } from "../utils/checks.js";
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

export default Session;

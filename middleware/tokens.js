import jwt from "jsonwebtoken";

class Tokens {
  constructor(secret, expiry = "1d") {
    this.secret = secret;
    this.expiry = expiry;
  }

  createToken = (value = {}) => {
    return jwt.sign(
      { exp: Date.now() + this.expiry, data: value },
      this.secret
    );
  };

  validateToken = (token) => {
    try {
      const value = jwt.verify(token, this.secret);
      return value;
    } catch {}
    return false;
  };
}

export default Tokens;

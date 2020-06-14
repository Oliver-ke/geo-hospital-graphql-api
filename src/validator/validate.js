require("dotenv").config();
const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");

const client = jwksClient({
  jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
});

const getKey = (header, callback) => {
  client.getSigningKey(header.kid, (error, key) => {
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

const isTokenValid = async (token) => {
  if (token) {
    const bearerToken = token.split(" ");
    const result = new Promise((resolve, reject) => {
      jwt.verify(
        bearerToken[1],
        getKey,
        {
          audience: process.env.API_IDENTIFIER,
          issuer: `https://${process.env.AUTH0_DOMAIN}/`,
          algorithms: ["RS256"]
        },
        (error, decoded) => {
          if (error) {
            // error handling is done later on the resolver function
            resolve({ error });
          }
          if (decoded) {
            resolve({ decoded });
          }
        }
      );
    });

    return result;
  }

  return { error: "No token provided" };
}

module.exports = isTokenValid;
const { auth, InvalidTokenError, UnauthorizedError } = require("express-oauth2-jwt-bearer");
const dotenv = require("dotenv");

dotenv.config();

const validateAuth0AccessToken = auth({
  issuerBaseURL: `https://${process.env.dev-eg03mr1pcwa4oe3l.us.auth0.com}`,
  audience: process.env.games,
});

module.exports = {
  validateAuth0AccessToken
};

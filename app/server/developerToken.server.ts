import jwt from "jsonwebtoken";

const privateKey =
  process.env.MUSICKIT_APPLE_PRIVATE_KEY?.replace(/\\n/g, "\n").toString() ||
  "";

export const developerToken = jwt.sign({}, privateKey, {
  algorithm: "ES256",
  expiresIn: "180d",
  issuer: process.env.MUSICKIT_TEAM_ID,
  header: {
    alg: "ES256",
    kid: process.env.MUSICKIT_KEY_ID,
  },
});

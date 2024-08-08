const jwt = require("jsonwebtoken");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const { AuthDataValidator } = require("@telegram-auth/server");
const { objectToAuthDataMap } = require("@telegram-auth/server/utils");

dotenv.config();

const app = express();
const port = process.env.PORT || 5005;

const privateKey = fs.readFileSync(process.env.PRIVATE_KEY_FILE_NAME);
const { TELEGRAM_BOT_NAME, TELEGRAM_BOT_TOKEN, SERVER_HOST_URL, CLIENT_URL } = process.env;
const TELEGRAM_REDIRECT_URI = `${SERVER_HOST_URL}/telegram/callback`;

app.use(cors());

// Allow requests from client-side
app.use(cors({ origin: CLIENT_URL }));

// Function to generate JWT token
const generateJwtToken = (userData) => {
  const payload = {
    telegram_id: userData.id,
    username: userData.username,
    avatar_url: userData.photo_url,
    sub: userData.id.toString(),
    name: userData.first_name,
    iss: "https://telegram.com",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour expiration
  };

  return jwt.sign(payload, privateKey, { algorithm: "RS256", keyid: "fc5be8134b6dada92b52" });
};

app.get("/", (req, res) => res.send("Express on Vercel"));

// Endpoint to serve the login page
app.get("/telegram/login", (req, res) => {
  const file = path.join(__dirname, "login.html");
  fs.readFile(file, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading login.html:", err);
      return res.status(500).send("Internal Server Error");
    }
    const result = data.replace(/{{TELEGRAM_BOT_NAME}}/g, TELEGRAM_BOT_NAME).replace(/{{TELEGRAM_BOT_CALLBACK}}/g, TELEGRAM_REDIRECT_URI);
    res.send(result);
  });
});

// Endpoint to handle the Telegram callback
app.get("/telegram/callback", async (req, res) => {
  const validator = new AuthDataValidator({ botToken: TELEGRAM_BOT_TOKEN });
  const data = objectToAuthDataMap(req.query || {});

  try {
    const user = await validator.validate(data);
    const JWTtoken = generateJwtToken(user);

    const redirectUrl = `${CLIENT_URL}?token=${JWTtoken}`; // Redirect back to frontend with token
    res.redirect(redirectUrl);
  } catch (error) {
    console.error("Error validating Telegram data:", error);
    res.status(400).send("Invalid Telegram data");
  }
});

app.listen(port, () => {
  console.log(`Server is running at ${SERVER_HOST_URL}:${port}`);
});

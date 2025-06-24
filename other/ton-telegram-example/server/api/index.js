const jwt = require("jsonwebtoken"); 
const fs = require("fs");
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const { validate } = require("@telegram-apps/init-data-node");
const RateLimit = require("express-rate-limit");

dotenv.config();

const app = express();
app.use(express.json()); // Middleware to parse JSON requests

const { TELEGRAM_BOT_TOKEN, JWT_KEY_ID, APP_URL } = process.env;
const privateKey = fs.readFileSync(path.resolve(__dirname, "privateKey.pem"), "utf8");

// Define allowed origins
const allowedOrigins = [APP_URL];

// CORS configuration
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept");
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept");
    return res.sendStatus(204);
  }
  next();
});

// Rate limiter configuration
const limiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

app.use(limiter);

// Helper function to generate JWT token
const generateJwtToken = (userData) => {
  const payload = {
    telegram_id: userData.id,
    username: userData.username,
    avatar_url: userData.photo_url || "https://www.gravatar.com/avatar",
    sub: userData.id.toString(),
    name: userData.first_name,
    iss: "https://api.telegram.org",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60, // Token valid for 1 hour
  };
  return jwt.sign(payload, privateKey, { algorithm: "RS256", keyid: JWT_KEY_ID });
};

// Route 1: Test route to check if the server is running
app.get("/test", (req, res) => {
  res.json({ message: "Connection successful. Server is running!" });
});

// Route 2: Telegram authentication route
app.post("/auth/telegram", async (req, res) => {
  const { initDataRaw, isMocked, photoUrl } = req.body; // Extract photoUrl from request body

  const sanitizedInitDataRaw = initDataRaw ? initDataRaw.replace(/\n|\r/g, "") : initDataRaw;
  console.log("Received initDataRaw (sanitized):", sanitizedInitDataRaw);
  const sanitizedIsMocked = Boolean(isMocked);
  console.log("isMocked (sanitized):", sanitizedIsMocked);
  const sanitizedPhotoUrl = photoUrl ? photoUrl.replace(/\n|\r/g, "") : photoUrl;
  console.log("photoUrl (sanitized):", sanitizedPhotoUrl); // Log the sanitized photoUrl for debugging

  if (!initDataRaw) {
    return res.status(400).json({ error: "initDataRaw is required" });
  }

  if (isMocked) {
    // Handle mock data parsing
    const data = new URLSearchParams(initDataRaw);
    const user = JSON.parse(decodeURIComponent(data.get("user")));

    const mockUser = {
      id: user.id,
      username: user.username,
      photo_url: photoUrl || user.photo_url || "https://www.gravatar.com/avatar", // Use photoUrl passed or fallback to user.photo_url
      first_name: user.first_name,
    };

    const JWTtoken = generateJwtToken(mockUser);
    return res.json({ token: JWTtoken });
  }

  try {
    // Validate the real initDataRaw using @telegram-apps/init-data-node
    validate(initDataRaw, TELEGRAM_BOT_TOKEN); // If validation fails, this will throw an error

    // If validation is successful, parse the data
    const data = new URLSearchParams(initDataRaw);
    const user = JSON.parse(decodeURIComponent(data.get("user")));

    const validatedUser = {
      ...user,
      photo_url: photoUrl || user.photo_url || "https://www.gravatar.com/avatar", // Use photoUrl passed or fallback to user.photo_url
    };

    // Generate the JWT token
    const JWTtoken = generateJwtToken(validatedUser);
    res.json({ token: JWTtoken });
  } catch (error) {
    console.error("Error validating Telegram data:", error);
    res.status(400).json({ error: "Invalid Telegram data" });
  }
});

// Start the server
app.listen(3000, () => console.log("Server ready on port 3000."));

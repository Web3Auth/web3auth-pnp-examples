const { Web3Auth } = require("@web3auth/node-sdk");
const { EthereumPrivateKeyProvider } = require("@web3auth/ethereum-provider");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const dotenv = require("dotenv");
const verifyAuthResult = require("@use-telegram-auth/server");
const {createHash} = require("crypto");
const { AuthDataValidator } = require('@telegram-auth/server');
const {urlStrToAuthDataMap} = require('@telegram-auth/server/utils');
const helmet = require('helmet');


dotenv.config();

const app = express();
const port = 5005;

const privateKey = fs.readFileSync(process.env.PRIVATE_KEY_FILE_NAME);
const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
const githubRedirectUri = process.env.GITHUB_REDIRECT_URI;


app.use(cors());
app.use(
    helmet.contentSecurityPolicy({
      directives: {
        "frame-ancestors": ["'self'", "http://127.0.0.1:5005"]
      }
    })
  );
app.use(function(req, res, next) {
    console.log("req.url", req.params);

    if (req.url.includes("#")) {
      req.url = req.url.replace("#", "?");
    }
    next();
 });

const privateKeyProvider = new EthereumPrivateKeyProvider({
    config: {
        chainConfig: {
            chainId: "0xaa36a7",
            rpcTarget: "https://rpc.ankr.com/eth_sepolia",
            displayName: "Sepolia",
            blockExplorer: "https://sepolia.etherscan.io/",
            ticker: "ETH",
            tickerName: "Ethereum",
        },
    },
});
const web3auth = new Web3Auth({
    clientId: "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ", // Get your Client ID from the Web3Auth Dashboard
    web3AuthNetwork: "sapphire_mainnet",
    usePnPKey: false, // Setting this to true returns the same key as PnP Web SDK, By default, this SDK returns CoreKitKey.
});
web3auth.init({ provider: privateKeyProvider });

const getPrivateKey = async (idToken, verifierId) => {
    const web3authNodeprovider = await web3auth.connect({
        verifier: "w3a-github-oauth-demo",
        verifierId,
        idToken,
    });
    // The private key returned here is the CoreKitKey
    const ethPrivateKey = await web3authNodeprovider.request({ method: "eth_private_key" });
    const ethPublicAddress = await web3authNodeprovider.request({ method: "eth_accounts" });
    const ethData = {
        ethPrivateKey,
        ethPublicAddress,
    };
    return ethData;
}

const exchangeCodeForAccessToken = async (code) => {
    try {
        const { data } = await axios.post(
            "https://github.com/login/oauth/access_token",
            {
                client_id: githubClientId,
                client_secret: githubClientSecret,
                code: code,
            },
            {
                headers: { Accept: "application/json" },
            }
        );
        return data.access_token;
    } catch (error) {
        console.error("Error exchanging code for access token:", error);
        throw new Error("Error during GitHub authentication");
    }
};

const fetchGitHubUserDetails = async (accessToken) => {
    try {
        const { data } = await axios.get('https://api.github.com/user', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        return data;
    } catch (error) {
        console.error("Error fetching GitHub user details:", error);
        throw new Error("Failed to fetch user details");
    }
};

const generateJwtToken = (userData) => {
    const payload = {
        github_id: userData.id,
        username: userData.login,
        avatar_url: userData.avatar_url,
        sub: userData.id.toString(),
        name: userData.name,
        email: userData.email || null,
        aud: "https://github.com/login/oauth/access_token",
        iss: "https://github.com",
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
    };

    return jwt.sign(payload, privateKey, { algorithm: "RS256", keyid: "33c21a45d72adfdc99a20" });
};

app.get("/telegram/login", (req, res) => {
     //6959558062:AAGKn92pAqeV42UoYTykUwZ0LyueEnlvGqY
    const telegramBotId = "6959558062"; // 6959558062
    const telegramRedirectUri = "http://127.0.0.1:5005/telegram/callback/";
    const domain = "http://127.0.0.1";
     /* res.redirect(
        `https://oauth.telegram.org/auth?bot_id=${telegramBotId}&return_to=${telegramRedirectUri}&origin=${domain}`
    ); */ 
    res.header("Content-Security-Policy", "http://127.0.0.1");
    
        res.send(`<h1>Hello, anonymous!</h1>
        <script async src="https://telegram.org/js/telegram-widget.js?22" data-telegram-login="oauth_w3a_bot" data-size="large" data-auth-url="http://127.0.0.1:5005/telegram/callback/" data-request-access="write"></script>
        `);
});

app.get("/telegram/callback", async (req, res) => {
    const validator = new AuthDataValidator({ botToken: 6959558062 });

    // convert the data from the URL to a map
    const data = urlStrToAuthDataMap(req.url);

    const tgAuthResult = req.query.tgAuthResult;
    console.log(req);

    try {
        res.status(500).send(JSON.stringify(req));
        const telegramBotToken = "AAGKn92pAqeV42UoYTykUwZ0LyueEnlvGqY";
        const HASHED_BOT_TOKEN = createHash("sha256").update(telegramBotToken).digest();

        const result = verifyAuthResult(tgAuthResult, HASHED_BOT_TOKEN);
        console.log(result);
        /* const accessToken = await exchangeCodeForAccessToken(code);
        console.log('accessToken', accessToken);
        const userData = await fetchGitHubUserDetails(accessToken);
        console.log('userData', userData);
        const jwtToken = generateJwtToken(userData);
        console.log('jwtToken', userData);
        const ethData = await getPrivateKey(jwtToken, userData.id.toString());
        res.json({ userData, jwtToken, ethData }); */
    } catch (error) {
        console.error(error);
        res.status(500).send("Error during GitHub authentication");
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

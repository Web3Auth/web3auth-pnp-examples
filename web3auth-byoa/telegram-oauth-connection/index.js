const { Web3Auth } = require("@web3auth/node-sdk");
const { EthereumPrivateKeyProvider } = require("@web3auth/ethereum-provider");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const dotenv = require("dotenv");
const path = require("path");
const { AuthDataValidator } = require("@telegram-auth/server");
const { objectToAuthDataMap } = require("@telegram-auth/server/utils");

dotenv.config();

const app = express();
const port = 5005;

const privateKey = fs.readFileSync(process.env.PRIVATE_KEY_FILE_NAME);
const { WEB3AUTH_VERIFIER_ID } = process.env;
const { TELEGRAM_BOT_NAME } = process.env;
const { TELEGRAM_BOT_TOKEN } = process.env;
const TELEGRAM_REDIRECT_URI = `${process.env.SERVER_HOST_URL}/telegram/callback`;

app.use(cors());

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
        verifier: WEB3AUTH_VERIFIER_ID,
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
};

const generateJwtToken = (userData) => {
    const payload = {
        telegram_id: userData.id,
        username: userData.username,
        avatar_url: userData.photo_url,
        sub: userData.id.toString(),
        name: userData.first_name,
        iss: "https://telegram.com",
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
    };

    return jwt.sign(payload, privateKey, { algorithm: "RS256", keyid: "fc5be8134b6dada92b52" });
};

// this is the start point
app.get("/telegram/login", async (req, res) => {
    // load file, replace string and send it
    const file = path.join(__dirname, "login.html");
    fs.readFile(file, "utf8", (err, data) => {
        if (err) {
            return console.log(err);
        }
        const result = data.replace(/{{TELEGRAM_BOT_NAME}}/g, TELEGRAM_BOT_NAME).replace(/{{TELEGRAM_BOT_CALLBACK}}/g, TELEGRAM_REDIRECT_URI);

        res.send(result);
    });
});

app.get("/telegram/callback", async (req, res) => {
    const token = TELEGRAM_BOT_TOKEN;
    const validator = new AuthDataValidator({ botToken: token });
    const data = objectToAuthDataMap(req.query || {});
    try {
        // validate the data
        const user = await validator.validate(data);
        const JWTtoken = generateJwtToken(user);
        // get the private key and address
        const ethData = await getPrivateKey(JWTtoken, user.id.toString());
        res.json({ user, JWTtoken, ethData });
    } catch (error) {
        console.error(error);
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

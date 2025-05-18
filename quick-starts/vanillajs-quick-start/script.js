import { Web3Auth, CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/modal";

let web3auth = null;

(async function init() {
  $(".btn-logged-in").hide();
  $("#sign-tx").hide();

  // IMP START - Dashboard Registration
  // Load client ID from environment variable or fallback to default
  const clientId = process.env.WEB3AUTH_CLIENT_ID || ""; // get your clientId from https://dashboard.web3auth.io
  // IMP END - Dashboard Registration

  // IMP START - Instantiate SDK
  const privateKeyProvider = new EthereumPrivateKeyProvider({
    config: { chainConfig }
  });

  const web3auth = new Web3Auth({
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
    privateKeyProvider: privateKeyProvider,
    authBuildEnv: "testing",
  });
  // IMP END - Instantiate SDK

  await web3auth.init();

  if (web3auth.connected) {
    $(".btn-logged-in").show();
    $(".btn-logged-out").hide();
  } else {
    $(".btn-logged-out").show();
    $(".btn-logged-in").hide();
  }
})();

$("#login").click(async function (event) {
  try {
    // IMP START - Login
    await web3auth.connect(); 
    // IMP END - Login
    $(".btn-logged-out").hide();
    $(".btn-logged-in").show();
    uiConsole("Logged in Successfully!");
  } catch (error) {
    console.error(error.message);
  }
});

$("#get-user-info").click(async function (event) {
  try {
    // IMP START - Get User Information
    const user = await web3auth.getUserInfo();
    // IMP END - Get User Information
    uiConsole(user);
  } catch (error) {
    console.error(error.message);
  }
});

// IMP START - Blockchain Calls
$("#get-accounts").click(async function (event) {
  try {
    const web3 = new Web3(web3auth.provider);

    // Get user's Ethereum public address
    const address = await web3.eth.getAccounts();
    uiConsole(address);
  } catch (error) {
    console.error(error.message);
  }
});

$("#get-balance").click(async function (event) {
  try {
    const web3 = new Web3(web3auth.provider);

    // Get user's Ethereum public address
    const address = (await web3.eth.getAccounts())[0];

    // Get user's balance in ether
    const balance = web3.utils.fromWei(
      await web3.eth.getBalance(address), // Balance is in wei
      "ether"
    );
    uiConsole(balance);
  } catch (error) {
    console.error(error.message);
  }
});

$("#sign-message").click(async function (event) {
  try {
    const web3 = new Web3(web3auth.provider);
    // Get user's Ethereum public address
    const fromAddress = (await web3.eth.getAccounts())[0];

    const originalMessage = "YOUR_MESSAGE";

    // Sign the message
    const signedMessage = await web3.eth.personal.sign(
      originalMessage,
      fromAddress,
      "test password!" // configure your own password here.
    );
    uiConsole(signedMessage);
  } catch (error) {
    console.error(error.message);
  }
});
// IMP END - Blockchain Calls

$("#logout").click(async function (event) {
  try {
    // IMP START - Logout
    await web3auth.logout();
    // IMP END - Logout
    $(".btn-logged-in").hide();
    $(".btn-logged-out").show();
  } catch (error) {
    console.error(error.message);
  }
});

function uiConsole(...args) {
  const el = document.querySelector("#console>p");
  if (el) {
    el.innerHTML = JSON.stringify(args || {}, null, 2);
    console.log(...args);
  }
}

# Web3Auth (`@web3auth/no-modal`) x ChromeExtension

[![Web3Auth](https://img.shields.io/badge/Web3Auth-SDK-blue)](https://web3auth.io/docs/sdk/web/no-modal/)
[![Web3Auth](https://img.shields.io/badge/Web3Auth-Community-cyan)](https://community.web3auth.io)

[Join our Community Portal](https://community.web3auth.io/) to get support and stay up to date with the latest news and updates.

This example demonstrates how to use Web3Auth with ChromeExtension.

## How to Use

### Download Manually

```bash
npx degit Web3Auth/web3auth-pnp-examples/web-no-modal-sdk/browser-extensions/chrome-extension-no-modal-example w3a-nomodal-chrome-extension-react
```

Install & Run:

```bash
cd w3a-nomodal-chrome-extension-react
npm install
npm run build
# or
cd w3a-nomodal-chrome-extension-react
yarn
yarn build
```

## Test Extension Locally

- Visit `chrome://extensions` in your Chrome Browser.
- Toggle `Developer Mode` in the top right of that same window.
- Click on `Load unpacked` and upload your `build` folder from above.

## Whitelist chrome extension url in Web3Auth Dashboard

- Add `chrome-extension://EXTENSION_ID` to
  [Web3Auth Dashboard](https://dashboard.web3auth.io)'s **Whitelist URLs**.

![Whitelist ChromeExtension URL in Web3Auth Dashboard](https://user-images.githubusercontent.com/6962565/202164016-5e4fd5db-af74-4190-ada1-408ae737a6b0.png)

## Important Links

- [Website](https://web3auth.io)
- [Docs](https://web3auth.io/docs)
- [Guides](https://web3auth.io/docs/guides)
- [SDK / API References](https://web3auth.io/docs/sdk)
- [Pricing](https://web3auth.io/pricing.html)
- [Community Portal](https://community.web3auth.io)
/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
(function() {
    if (typeof globalThis === 'undefined') {
      if (typeof global !== 'undefined') {
        global.globalThis = global;
      } else if (typeof self !== 'undefined') {
        self.globalThis = self;
      } else if (typeof window !== 'undefined') {
        window.globalThis = window;
      } else {
        throw new Error('Unable to locate global object');
      }
    }
  })();

  const { fetch: originalFetch } = globalThis;

  const TRON_API_HOST = "api.trongrid.io";
  const TRON_PRO_API_KEY = "022c1726-c222-4755-a213-ce0196086a85";

  globalThis.fetch = (...args) => {
    const [resource, config = {}] = args;
    const url = new URL(resource);
    const headers = new Headers(config.headers || {});

    if (url.hostname === TRON_API_HOST) {
      headers.append("TRON-PRO-API-KEY", TRON_PRO_API_KEY);
    }

    // if (config.method === "POST" || url.pathname === "/wallet/createtransaction") {
    //   headers.append("Content-Type", "application/json");
    // }

    return originalFetch(resource, { ...config, headers });
  };


// maharshi@Maharshis-MacBook-Pro ~ % curl -X POST \
//   https://api.trongrid.io/jsonrpc \
//   -H 'TRON-PRO-API-KEY: 022c1726-c222-4755-a213-ce0196086a85' \
//   -d '{
//         "jsonrpc": "2.0",
//         "method": "eth_getBlockByNumber",
//         "params": ["latest", false],
//         "id": "qdz4633eudl"
// }'
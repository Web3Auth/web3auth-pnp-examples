import bowser from "bowser";

const PASSKEYS_ALLOWED_MAP = [bowser.OS_MAP.iOS, bowser.OS_MAP.MacOS, bowser.OS_MAP.Android, bowser.OS_MAP.Windows];

const getWindowsVersion = (osVersion: string) => {
  const windowsVersionRegex = /NT (\d+\.\d+)/;
  const match = osVersion.match(windowsVersionRegex);
  if (match) return parseInt(match[1], 10);
  return 0;
};

const checkIfOSIsSupported = (osName: string, osVersion: string) => {
  if (!PASSKEYS_ALLOWED_MAP.includes(osName)) return false;
  if (osName === bowser.OS_MAP.MacOS) return true;
  switch (osName) {
    case bowser.OS_MAP.iOS: {
      const version = parseInt(osVersion.split(".")[0], 10);
      return version >= 16;
    }
    case bowser.OS_MAP.Android: {
      const version = parseInt(osVersion.split(".")[0], 10);
      return version >= 9;
    }
    case bowser.OS_MAP.Windows: {
      const version = getWindowsVersion(osVersion);
      return version >= 10;
    }
    default:
      return false;
  }
};

export function shouldSupportPasskey(): { isBrowserSupported: boolean; isOsSupported: boolean; supportedBrowser?: Record<string, string> } {
  const browser = bowser.getParser(navigator.userAgent);
  const osDetails = browser.parseOS();
  if (!osDetails) return { isBrowserSupported: false, isOsSupported: false };
  const osName = osDetails.name || "";
  const result = checkIfOSIsSupported(osName, osDetails.version || "");
  if (!result) return { isBrowserSupported: false, isOsSupported: false };
  const browserData: Record<string, Record<string, string>> = {
    iOS: {
      safari: ">=16",
      chrome: ">=108",
    },
    macOS: {
      safari: ">=16",
      chrome: ">=108",
      firefox: ">=122",
    },
    Android: {
      chrome: ">=121",
    },
    Windows: {
      edge: ">=108",
      chrome: ">=108",
    },
  };
  const isBrowserSupported = browser.satisfies({ ...browserData }) || false;
  return { isBrowserSupported, isOsSupported: true, supportedBrowser: browserData[osName] };
}

export function browserSupportsWebAuthn() {
  return window?.PublicKeyCredential !== undefined && typeof window.PublicKeyCredential === "function";
}

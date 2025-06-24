/* eslint-disable camelcase */
import { mockTelegramEnv, parseInitData, retrieveLaunchParams } from '@telegram-apps/sdk-react';

/**
 * Mocks Telegram environment in development mode.
 */
export function useTelegramMock(): void {
  if (process.env.NODE_ENV !== "development") return; // Only run in development mode

  let shouldMock: boolean;

  try {
      retrieveLaunchParams();
      shouldMock = !!sessionStorage.getItem('____mocked');
    } catch (e) {
      shouldMock = true;
    }

    if (shouldMock) {
      const randomId = Math.floor(Math.random() * 1000000000); // Generate a random id between 0 and 1 billion

      const initDataRaw = new URLSearchParams([
        [
          'user',
          JSON.stringify({
            id: randomId, // Randomized user ID
            first_name: 'Andrew',
            last_name: 'Rogue',
            username: 'rogue',
            language_code: 'en',
            is_premium: true,
            allows_write_to_pm: true,
          }),
        ],
        ["hash", "89d6079ad6762351f38c6dbbc41bb53048019256a9443988af7a48bcad16ba31"],
        ["auth_date", "1716922846"], // Use a fixed or provided auth_date
        ["start_param", "debug"],
        ["chat_type", "sender"],
        ["chat_instance", "8428209589180549439"],
      ]).toString();

    mockTelegramEnv({
      themeParams: {
        accentTextColor: '#6ab2f2',
        bgColor: '#17212b',
        buttonColor: '#5288c1',
        buttonTextColor: '#ffffff',
        destructiveTextColor: '#ec3942',
        headerBgColor: '#17212b',
        hintColor: '#708499',
        linkColor: "#6ab3f3",
        secondaryBgColor: "#232e3c",
        sectionBgColor: "#17212b",
        sectionHeaderTextColor: "#6ab3f3",
        subtitleTextColor: "#708499",
        textColor: "#f5f5f5",
      },
      initData: parseInitData(initDataRaw),
      initDataRaw,
      version: "7.7",
      platform: "tdesktop",
    });

    sessionStorage.setItem("____mocked", "1");
  }
}

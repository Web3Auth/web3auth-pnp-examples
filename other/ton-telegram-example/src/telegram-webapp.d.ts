// Extend the global Window interface to include Telegram WebApp
interface Window {
  Telegram?: {
    WebApp?: {
      initData: string;
      initDataUnsafe: any;
      close: () => void;
      // Add other WebApp methods if needed
    };
  };
}

export {};

declare global {
  namespace NodeJS {
    interface Global {
      trackPageView: (url: string) => void;
    }
  }
}

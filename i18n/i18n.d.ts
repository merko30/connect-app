import "i18next";
import en from "./en.json";

declare module "i18next" {
  interface CustomTypeOptions {
    resources: {
      translation: typeof en;
    };
  }
}

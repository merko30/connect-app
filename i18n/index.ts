import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./en.json";
import sl from "./sl.json";

export const resources = {
  en: { translation: en },
  sl: { translation: sl },
} as const;

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "sl",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

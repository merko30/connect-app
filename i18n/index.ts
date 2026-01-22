import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./en.json";
import sl from "./sl.json";

export const resources = {
  en: { translation: en },
  sl: { translation: sl },
} as const;

type DeepKeys3<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends string
        ? K
        : T[K] extends object
          ? {
              [K2 in keyof T[K] & string]: T[K][K2] extends string
                ? `${K}.${K2}`
                : T[K][K2] extends object
                  ? {
                      [K3 in keyof T[K][K2] &
                        string]: T[K][K2][K3] extends string
                        ? `${K}.${K2}.${K3}`
                        : never;
                    }[keyof T[K][K2] & string]
                  : never;
            }[keyof T[K] & string]
          : never;
    }[keyof T & string]
  : never;

export type TranslationKey = DeepKeys3<typeof en>;

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

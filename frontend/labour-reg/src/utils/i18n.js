import en from "../locales/en.json";
import mr from "../locales/mr.json";
import hi from "../locales/hi.json";
// later:
// import hi from "./locales/hi.json";
// import mr from "./locales/mr.json";

const languages = {
  en,
  mr,
  hi,
};

export function t(lang, key) {
  return languages[lang]?.[key] || languages.en?.[key] || key;
}

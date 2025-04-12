import antdEnUS from "antd/es/locale/en_US";
import antdZhCn from "antd/es/locale/zh_CN";
import en from "./locales/en_US.json";
import zh from "./locales/zh_CN.json";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { THEME_CONFIG } from "config/Admin/AppCofig";

type ResourcesType = {
  [key: string]: {
    translation: {
      [key: string]: string;
    };
    antd: any;
  };
};

export const resources: ResourcesType = {
  en: {
    translation: en,
    antd: antdEnUS,
  },
  zh: {
    translation: zh,
    antd: antdZhCn,
  },
};

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: THEME_CONFIG.locale,
  lng: THEME_CONFIG.locale,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

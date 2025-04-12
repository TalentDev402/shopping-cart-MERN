import {
  SIDE_NAV_LIGHT,
  NAV_TYPE_SIDE,
  DIR_LTR,
} from "utils/constants/Admin/ThemeConstant";

export const APP_NAME = "Apparel Empire";
export const AUTHENTICATED_ENTRY = "/admin/dashboard";
export const UNAUTHENTICATED_ENTRY = "/admin/login";

export const THEME_CONFIG = {
  navCollapsed: false,
  sideNavTheme: SIDE_NAV_LIGHT,
  locale: "en",
  navType: NAV_TYPE_SIDE,
  topNavColor: "#3e82f7",
  headerNavColor: "",
  mobileNav: false,
  currentTheme: "light",
  direction: DIR_LTR,
  blankLayout: false,
};

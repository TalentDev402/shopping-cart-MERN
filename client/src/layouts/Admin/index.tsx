import React, { createContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ConfigProvider, message } from "antd";
import { ThemeSwitcherProvider } from "react-css-theme-switcher";
import { THEME_CONFIG } from "config/Admin/AppCofig";
import { lightTheme, darkTheme } from "config/Admin/ThemeConfig";
import { resources } from "lang";
import { RootState } from "store";
import AdminRouter from "routes/Admin";
import "antd/dist/reset.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { apis } from "apis";
import { setPages } from "store/slices/settingSlice";

const themes = {
  dark: `${process.env.PUBLIC_URL}/css/admin/dark-theme.css`,
  light: `${process.env.PUBLIC_URL}/css/admin/light-theme.css`,
};

export const MessageContext = createContext<any>(null);

const AdminLayout = () => {
  const dispatch = useDispatch();
  const { locale, currentTheme, direction } = useSelector(
    (state: RootState) => state.theme
  );

  const { pages } = useSelector((state: RootState) => state.setting);

  const currentAppLocale = resources[locale];
  const themeConfig =
    currentTheme === "light" ? { ...lightTheme } : { ...darkTheme };

  const [messageApi, contextHolder] = message.useMessage();

  const GetPages = async () => {
    try {
      const response: any = await apis.GetPagesSetting();
      if (response.success) {
        dispatch(setPages(response.pages));
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    GetPages();
  }, []);

  return (
    <HelmetProvider>
      <ThemeSwitcherProvider
        themeMap={themes}
        defaultTheme={THEME_CONFIG.currentTheme}
      >
        <ConfigProvider
          theme={themeConfig as any}
          direction={direction as any}
          locale={currentAppLocale.antd}
        >
          <Helmet>
            <title>{pages?.dashboard.title}</title>
            <link
              rel="icon"
              href={`${process.env.REACT_APP_SERVER_URL}/${pages?.dashboard.icon}`}
            />
          </Helmet>
          {contextHolder}
          <MessageContext.Provider value={messageApi}>
            <AdminRouter />
          </MessageContext.Provider>
        </ConfigProvider>
      </ThemeSwitcherProvider>
    </HelmetProvider>
  );
};

export default AdminLayout;

import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Menu, Grid } from "antd";
import IntlMessage from "../Util-components/IntlMessage";
import Icon from "../Util-components/Icon";
import navigationConfig from "config/Admin/NavigationConfig";
import { useSelector, useDispatch } from "react-redux";
import { SIDE_NAV_LIGHT } from "utils/constants/Admin/ThemeConstant";
import utils from "utils";
import { onMobileNavToggle } from "store/slices/themeSlice";
import { RootState } from "store";

const { useBreakpoint } = Grid;

const setLocale = (localeKey: any, isLocaleOn = true) =>
  isLocaleOn ? <IntlMessage id={localeKey} /> : localeKey.toString();

const setDefaultOpen = (key: any) => {
  let keyList = [];
  let keyString = "";
  if (key) {
    const arr = key.split("-");
    for (let index = 0; index < arr.length; index++) {
      const elm = arr[index];
      index === 0 ? (keyString = elm) : (keyString = `${keyString}-${elm}`);
      keyList.push(keyString);
    }
  }
  return keyList;
};

const MenuItem = ({
  title,
  icon,
  path,
}: {
  title: any;
  icon?: any;
  path?: any;
}) => {
  const dispatch = useDispatch();

  const isMobile = !utils.getBreakPoint(useBreakpoint()).includes("lg");

  const closeMobileNav = () => {
    if (isMobile) {
      dispatch(onMobileNavToggle(false));
    }
  };

  return (
    <>
      {icon && <Icon type={icon} />}
      <span>{setLocale(title)}</span>
      {path && <Link onClick={closeMobileNav} to={path} />}
    </>
  );
};

const getSideNavMenuItem = (navItem: any) =>
  navItem.map((nav: any) => {
    return {
      key: nav.key,
      label: (
        <MenuItem
          title={nav.title}
          {...(nav.isGroupTitle ? {} : { path: nav.path, icon: nav.icon })}
        />
      ),
      ...(nav.isGroupTitle ? { type: "group" } : {}),
      ...(nav.submenu.length > 0
        ? { children: getSideNavMenuItem(nav.submenu) }
        : {}),
    };
  });

const SideNavContent = (props: any) => {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const { routeInfo, hideGroupTitle, sideNavTheme = SIDE_NAV_LIGHT } = props;
  const menuItems = useMemo(
    () =>
      getSideNavMenuItem(
        currentUser?.role === "SUPER_ADMIN"
          ? navigationConfig.superAdminNav
          : navigationConfig.adminNav
      ),
    [currentUser]
  );

  return (
    <Menu
      mode="inline"
      theme={sideNavTheme === SIDE_NAV_LIGHT ? "light" : "dark"}
      style={{ height: "100%", borderInlineEnd: 0 }}
      defaultSelectedKeys={[routeInfo?.key]}
      defaultOpenKeys={setDefaultOpen(routeInfo?.key)}
      className={hideGroupTitle ? "hide-group-title" : ""}
      items={menuItems}
    />
  );
};

const MenuContent = (props: any) => {
  return <SideNavContent {...props} />;
};

export default MenuContent;

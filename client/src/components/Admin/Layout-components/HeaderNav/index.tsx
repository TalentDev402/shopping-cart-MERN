/** @jsxImportSource @emotion/react */
import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { TEMPLATE } from "utils/constants/Admin/ThemeConstant";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import Logo from "../Logo";
import NavNotification from "../NavNotification";
import NavProfile from "../NavProfile";
import NavLanguage from "../NavLanguage";
import NavPanel from "../NavPanel";
import Header from "./Header";
import HeaderWrapper from "./HeaderWrapper";
import Nav from "./Nav";
import NavEdge from "./NavEdge";
import NavItem from "../NavItem";
import { toggleCollapsedNav, onMobileNavToggle } from "store/slices/themeSlice";
import {
  NAV_TYPE_TOP,
  SIDE_NAV_COLLAPSED_WIDTH,
  SIDE_NAV_WIDTH,
} from "utils/constants/Admin/ThemeConstant";
import utils from "utils";
import { RootState } from "store";

export const HeaderNav = (props: any) => {
  const { isMobile } = props;

  const dispatch = useDispatch();

  const navCollapsed = useSelector(
    (state: RootState) => state.theme.navCollapsed
  );
  const mobileNav = useSelector((state: RootState) => state.theme.mobileNav);
  const navType = useSelector((state: RootState) => state.theme.navType);
  const headerNavColor = useSelector(
    (state: RootState) => state.theme.headerNavColor
  );
  const currentTheme = useSelector(
    (state: RootState) => state.theme.currentTheme
  );
  const direction = useSelector((state: RootState) => state.theme.direction);

  const onToggle = () => {
    if (!isMobile) {
      dispatch(toggleCollapsedNav(!navCollapsed));
    } else {
      dispatch(onMobileNavToggle(!mobileNav));
    }
  };

  const isNavTop = navType === NAV_TYPE_TOP;
  const isDarkTheme = currentTheme === "dark";

  const navMode = useMemo(() => {
    if (!headerNavColor) {
      return utils.getColorContrast(isDarkTheme ? "#000000" : "#ffffff");
    }
    return utils.getColorContrast(headerNavColor);
  }, [isDarkTheme, headerNavColor]);

  const navBgColor = isDarkTheme
    ? TEMPLATE.HEADER_BG_DEFAULT_COLOR_DARK
    : TEMPLATE.HEADER_BG_DEFAULT_COLOR_LIGHT;

  const getNavWidth = () => {
    if (isNavTop || isMobile) {
      return "0px";
    }
    if (navCollapsed) {
      return `${SIDE_NAV_COLLAPSED_WIDTH}px`;
    } else {
      return `${SIDE_NAV_WIDTH}px`;
    }
  };

  return (
    <Header
      isDarkTheme={isDarkTheme}
      headerNavColor={headerNavColor || navBgColor}
    >
      <HeaderWrapper isNavTop={isNavTop}>
        <Logo logoType={navMode} />
        <Nav navWidth={getNavWidth()}>
          <NavEdge left>
            {isNavTop && !isMobile ? null : (
              <NavItem onClick={onToggle} mode={navMode}>
                <div className="d-flex align-items-center">
                  {navCollapsed || isMobile ? (
                    <MenuUnfoldOutlined className="nav-icon" />
                  ) : (
                    <MenuFoldOutlined className="nav-icon" />
                  )}
                </div>
              </NavItem>
            )}
          </NavEdge>
          <NavEdge right>
            {/* <NavNotification mode={navMode} /> */}
            {/* <NavLanguage mode={navMode} /> */}
            {/* <NavPanel direction={direction} mode={navMode} /> */}
            <NavProfile mode={navMode} />
          </NavEdge>
        </Nav>
      </HeaderWrapper>
    </Header>
  );
};

export default HeaderNav;

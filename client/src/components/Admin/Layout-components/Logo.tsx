import { APP_NAME } from "config/Admin/AppCofig";
import { useSelector } from "react-redux";
import utils from "utils";
import { Grid, Typography } from "antd";
import styled from "@emotion/styled";
import {
  TEMPLATE,
  SIDE_NAV_WIDTH,
  SIDE_NAV_COLLAPSED_WIDTH,
  NAV_TYPE_TOP,
} from "utils/constants/Admin/ThemeConstant";
import { RootState } from "store";
import { useEffect, useState } from "react";

const LogoWrapper = styled.div(() => ({
  height: TEMPLATE.HEADER_HEIGHT,
  display: "flex",
  alignItems: "center",
  padding: "0 1rem",
  backgroundColor: "transparent",
  transition: "all .2s ease",
}));

const { useBreakpoint } = Grid;

export const Logo = ({
  mobileLogo,
  logoType,
}: {
  mobileLogo?: boolean;
  logoType: "light" | "dark";
}) => {
  const isMobile = !utils.getBreakPoint(useBreakpoint()).includes("lg");
  const navCollapsed = useSelector(
    (state: RootState) => state.theme.navCollapsed
  );
  const navType = useSelector((state: RootState) => state.theme.navType);

  const [logo, setLogo] = useState('');
  const { pages } = useSelector((state: RootState) => state.setting);
  useEffect(() => {
    setLogo(pages?.dashboard.logo);
  },[pages]);
  const getLogoWidthGutter = () => {
    const isNavTop = navType === NAV_TYPE_TOP ? true : false;
    if (isMobile && !mobileLogo) {
      return 0;
    }
    if (isNavTop) {
      return "auto";
    }
    if (navCollapsed) {
      return `${SIDE_NAV_COLLAPSED_WIDTH}px`;
    } else {
      return `${SIDE_NAV_WIDTH}px`;
    }
  };

  return (
    <LogoWrapper
      className={isMobile && !mobileLogo ? "d-none" : "logo"}
      style={{
        width: `${getLogoWidthGutter()}`,
        display: "flex",
        gap: 10
      }}
    >
      <img src={`${process.env.REACT_APP_SERVER_URL}/${logo}`} alt={`${APP_NAME} logo`} width={50}/>
      <Typography.Title level={3} 
        style={{ margin: 0 }}
      >
        {(navCollapsed && !isMobile) ? "" : APP_NAME.toUpperCase()}
      </Typography.Title>
    </LogoWrapper>
  );
};

export default Logo;

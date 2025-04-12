import React, { Suspense } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import SideNav from "components/Admin/Layout-components/SideNav";
import Loading from "components/Admin/Shared-components/Loading";
import MobileNav from "components/Admin/Layout-components/MobileNav";
import HeaderNav from "components/Admin/Layout-components/HeaderNav";
import Footer from "components/Admin/Layout-components/Footer";
import { Layout, Grid } from "antd";
import navigationConfig from "config/Admin/NavigationConfig";
import { TEMPLATE, MEDIA_QUERIES } from "utils/constants/Admin/ThemeConstant";
import styled from "@emotion/styled";
import utils from "utils";
import { MessageContext } from ".";
import { setSetting } from "store/slices/settingSlice";
import { type RootState } from "store";
import { apis } from "apis";
import { UNAUTHENTICATED_ENTRY } from "config/Admin/AppCofig";
import { setCurrentUser } from "store/slices/authSlice";

const { Content } = Layout;
const { useBreakpoint } = Grid;

const AppContent = styled("div") <any>`
  padding: ${TEMPLATE.LAYOUT_CONTENT_GUTTER}px;
  margin-top: ${TEMPLATE.HEADER_HEIGHT}px;
  min-height: calc(100vh - ${TEMPLATE.CONTENT_HEIGHT_OFFSET}px);
  position: relative;

  ${(props) =>
    props.isNavTop
      ? `
        max-width: ${TEMPLATE.CONTENT_MAX_WIDTH}px;
        margin-left: auto;
        margin-right: auto;
        width: 100%;

        @media ${MEDIA_QUERIES.DESKTOP} {
            margin-top: ${TEMPLATE.HEADER_HEIGHT + TEMPLATE.TOP_NAV_HEIGHT}px;
            min-height: calc(100vh - ${TEMPLATE.CONTENT_HEIGHT_OFFSET}px - ${TEMPLATE.TOP_NAV_HEIGHT
      }px);
        }
    `
      : ""}

  @media ${MEDIA_QUERIES.MOBILE} {
    padding: ${TEMPLATE.LAYOUT_CONTENT_GUTTER_SM}px;
  }
`;

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const messageAPI = React.useContext(MessageContext);
  const location = useLocation();
  const currentRouteInfo = utils.getRouteInfo(
    navigationConfig,
    location.pathname
  );
  const screens = utils.getBreakPoint(useBreakpoint());
  const isMobile = screens.length === 0 ? false : !screens.includes("lg");
  const { navCollapsed } = useSelector((state: RootState) => state.theme);

  const getLayoutGutter = () => {
    if (isMobile) {
      return 0;
    }
    return navCollapsed
      ? TEMPLATE.SIDE_NAV_COLLAPSED_WIDTH
      : TEMPLATE.SIDE_NAV_WIDTH;
  };

  const GetSetting = async () => {
    try {
      const response: any = await apis.GetSetting();
      if (response.success) {
        dispatch(setSetting(response.setting));
      }
    } catch (err: any) {
      messageAPI.open({
        type: "error",
        content: err.response.data.message,
      });
    }
  };

  const getCurrentUser = async () => {
    try {
      const response: any = await apis.GetCurrentUser();
      if (response.success) {
        dispatch(setCurrentUser(response.user));
      } else {
        messageAPI.open({
          type: "error",
          content: response.message,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    if (token === null) {
      navigate(UNAUTHENTICATED_ENTRY);
    } else {
      getCurrentUser();
      GetSetting();
    }
  }, [token]);

  return token ? (
    <Layout>
      <HeaderNav isMobile={isMobile} />
      <Layout>
        {!isMobile ? <SideNav routeInfo={currentRouteInfo} /> : null}
        <Layout style={{ paddingLeft: getLayoutGutter() }}>
          <AppContent>
            <Content className="h-100">
              <Suspense fallback={<Loading cover="content" />}>
                {children}
              </Suspense>
            </Content>
          </AppContent>
          <Footer />
        </Layout>
      </Layout>
      {isMobile && <MobileNav routeInfo={currentRouteInfo} />}
    </Layout>
  ) : (
    <Navigate replace to={UNAUTHENTICATED_ENTRY} />
  );
};

export default AppLayout;

import { Drawer } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { NAV_TYPE_SIDE } from "utils/constants/Admin/ThemeConstant";
import { Scrollbars } from "react-custom-scrollbars-2";
import MenuContent from "./MenuContent";
import { onMobileNavToggle } from "store/slices/themeSlice";
import Logo from "./Logo";
import Flex from "components/Admin/Shared-components/Flex";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { RootState } from "store";

export const MobileNav = ({
  routeInfo,
  hideGroupTitle,
}: {
  routeInfo: any;
  hideGroupTitle?: any;
}) => {
  const dispatch = useDispatch();
  const currentTheme = useSelector(
    (state: RootState) => state.theme.currentTheme
  );
  const mobileNav = useSelector((state: RootState) => state.theme.mobileNav);

  const menuContentprops = { routeInfo, hideGroupTitle };

  const onClose = () => {
    dispatch(onMobileNavToggle(false));
  };

  return (
    <Drawer
      placement="left"
      closable={false}
      onClose={onClose}
      open={mobileNav}
      styles={{
        body: {
          padding: 5,
        },
      }}
      width={300}
    >
      <Flex flexDirection="column" className="h-100">
        <Flex justifyContent="space-evenly" alignItems="center">
          <Logo
            logoType={currentTheme === "dark" ? "light" : "dark"}
            mobileLogo={true}
          />
          <div className="" onClick={() => onClose()}>
            <ArrowLeftOutlined />
          </div>
        </Flex>
        <div className="h-100">
          <Scrollbars autoHide>
            <MenuContent type={NAV_TYPE_SIDE} {...menuContentprops} />
          </Scrollbars>
        </div>
      </Flex>
    </Drawer>
  );
};

export default MobileNav;

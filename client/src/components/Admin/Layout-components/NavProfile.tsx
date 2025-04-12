import { Dropdown, Avatar } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  EditOutlined,
  SettingOutlined,
  ShopOutlined,
  QuestionCircleOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import NavItem from "./NavItem";
import Flex from "components/Admin/Shared-components/Flex";
import styled from "@emotion/styled";
import {
  FONT_WEIGHT,
  MEDIA_QUERIES,
  SPACER,
  FONT_SIZES,
} from "utils/constants/Admin/ThemeConstant";
import { signOutSuccess } from "store/slices/authSlice";
import { RootState } from "store";

const Icon = styled.div(() => ({
  fontSize: FONT_SIZES.LG,
}));

const Profile = styled.div(() => ({
  display: "flex",
  alignItems: "center",
}));

const UserInfo = styled("div")`
  padding-left: ${SPACER[2]};

  @media ${MEDIA_QUERIES.MOBILE} {
    display: none;
  }
`;

const Name = styled.div(() => ({
  fontWeight: FONT_WEIGHT.SEMIBOLD,
}));

const Title = styled.span(() => ({
  opacity: 0.8,
}));

const MenuItem = (props: any) => (
  <Flex as="a" href={props.path} alignItems="center" gap={SPACER[2]}>
    <Icon>{props.icon}</Icon>
    <span>{props.label}</span>
  </Flex>
);

const MenuItemSignOut = (props: any) => {
  const dispatch = useDispatch();

  const handleSignOut = () => {
    dispatch(signOutSuccess());
  };

  return (
    <div onClick={handleSignOut}>
      <Flex alignItems="center" gap={SPACER[2]}>
        <Icon>
          <LogoutOutlined />
        </Icon>
        <span>{props.label}</span>
      </Flex>
    </div>
  );
};

const items = [
  {
    key: "Change Password",
    label: <MenuItem path="/admin/setting/account" label="Change Password" icon={<EditOutlined />} />,
  },
  // {
  //   key: "Account Setting",
  //   label: (
  //     <MenuItem
  //       path="/app/pages/setting"
  //       label="Account Setting"
  //       icon={<SettingOutlined />}
  //     />
  //   ),
  // },
  // {
  //   key: "Account Billing",
  //   label: (
  //     <MenuItem path="/" label="Account Billing" icon={<ShopOutlined />} />
  //   ),
  // },
  // {
  //   key: "Help Center",
  //   label: (
  //     <MenuItem
  //       path="/"
  //       label="Help Center"
  //       icon={<QuestionCircleOutlined />}
  //     />
  //   ),
  // },
  {
    key: "Sign Out",
    label: <MenuItemSignOut label="Sign Out" />,
  },
];

export const NavProfile = ({ mode }: { mode: any }) => {
  const { currentUser } = useSelector((state: RootState) => state.auth);

  return (
    <Dropdown placement="bottomRight" menu={{ items }} trigger={["click"]}>
      <NavItem mode={mode}>
        <Profile>
          <Avatar
            src={
              currentUser?.avatar
                ? `${process.env.REACT_APP_SERVER_URL}/${currentUser?.avatar}`
                : ""
            }
            icon={currentUser?.avatar ? undefined : <UserOutlined />}
          />
          <UserInfo className="profile-text">
            <Name>
              {currentUser?.firstName} {currentUser?.lastName}
            </Name>
            <Title>
              {currentUser?.role === "SUPER_ADMIN"
                ? "SUPER ADMIN"
                : currentUser?.role === "ADMIN"
                ? "ADMIN"
                : ""}
            </Title>
          </UserInfo>
        </Profile>
      </NavItem>
    </Dropdown>
  );
};

export default NavProfile;

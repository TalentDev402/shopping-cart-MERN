import { APP_NAME } from "config/Admin/AppCofig";
import {
  TEMPLATE,
  DARK_MODE,
  BORDER,
} from "utils/constants/Admin/ThemeConstant";
import { useSelector } from "react-redux";
import { RootState } from "store";

export default function Footer() {
  const currentTheme = useSelector(
    (state: RootState) => state.theme.currentTheme
  );

  const { companyInfo } = useSelector((state: RootState) => state.setting);

  return (
    <footer
      style={{
        height: `${TEMPLATE.FOOTER_HEIGHT}px`,
        display: "flex",
        margin: `0 ${TEMPLATE.LAYOUT_CONTENT_GUTTER}px`,
        alignItems: "center",
        borderTop: `1px solid ${
          currentTheme === "dark"
            ? DARK_MODE.BORDER_BASE_COLOR
            : BORDER.BASE_COLOR
        }`,
      }}
      className="admin-footer"
    >
      <span>
        Copyright &copy; {`${new Date().getFullYear()}`}{" "}
        <span className="font-weight-semibold">{`${companyInfo?.name}`}</span> All rights
        reserved.
      </span>
      <div>
        <a className="text-gray" href="/#" onClick={(e) => e.preventDefault()}>
          Term & Conditions
        </a>
        <span className="mx-2 text-muted"> | </span>
        <a className="text-gray" href="/#" onClick={(e) => e.preventDefault()}>
          Privacy & Policy
        </a>
      </div>
    </footer>
  );
}

import { useSelector, useDispatch } from "react-redux";
import { Radio, Switch } from "antd";
import {
  toggleCollapsedNav,
  onNavStyleChange,
  onTopNavColorChange,
  onHeaderNavColorChange,
  onSwitchTheme,
} from "store/slices/themeSlice";
import ColorPicker from "components/Admin/Shared-components/ColorPicker";
import NavLanguage from "./NavLanguage";
import {
  SIDE_NAV_LIGHT,
  NAV_TYPE_TOP,
  SIDE_NAV_DARK,
} from "utils/constants/Admin/ThemeConstant";
import { useThemeSwitcher } from "react-css-theme-switcher";
import utils from "utils/index";
import { RootState } from "store";

const ListOption = ({
  name,
  selector,
  disabled,
  vertical,
}: {
  name: any;
  selector: any;
  disabled?: any;
  vertical?: any;
}) => (
  <div
    className={`my-4 ${
      vertical ? "" : "d-flex align-items-center justify-content-between"
    }`}
  >
    <div
      className={`${disabled ? "opacity-0-3" : ""} ${vertical ? "mb-3" : ""}`}
    >
      {name}
    </div>
    <div>{selector}</div>
  </div>
);

export const ThemeConfigurator = () => {
  const dispatch = useDispatch();

  const {
    navType,
    sideNavTheme,
    navCollapsed,
    topNavColor,
    headerNavColor,
    currentTheme,
  } = useSelector((state: RootState) => state.theme);

  const isNavTop = navType === NAV_TYPE_TOP;
  const isCollapse = navCollapsed;

  const { switcher, themes } = useThemeSwitcher();

  const toggleTheme = (isChecked: any) => {
    onHeaderNavColorChange("");
    const changedTheme = isChecked ? "dark" : "light";
    dispatch(onSwitchTheme(changedTheme));
    switcher({ theme: themes[changedTheme] });
  };

  const ontopNavColorClick = (value: any) => {
    dispatch(onHeaderNavColorChange(""));
    const { rgb } = value;
    const rgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`;
    const hex = utils.rgbaToHex(rgba);
    dispatch(onTopNavColorChange(hex));
  };

  const onHeaderNavColorClick = (value: any) => {
    const { rgb } = value;
    const rgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`;
    const hex = utils.rgbaToHex(rgba);
    dispatch(onHeaderNavColorChange(hex));
  };

  const haddleNavStyleChange = (style: any) => {
    dispatch(onNavStyleChange(style));
  };

  const handleToggleCollapseNav = () => {
    dispatch(toggleCollapsedNav(!navCollapsed));
  };

  return (
    <>
      <div className="mb-5">
        <h4 className="mb-3 font-weight-bold">Navigation</h4>
        {isNavTop ? (
          <ListOption
            name="Top Nav Color:"
            vertical
            selector={
              <ColorPicker
                color={topNavColor}
                colorChange={ontopNavColorClick}
              />
            }
          />
        ) : (
          <ListOption
            name="Header Nav Color:"
            vertical
            selector={
              <ColorPicker
                color={headerNavColor}
                colorChange={onHeaderNavColorClick}
              />
            }
          />
        )}
        <ListOption
          name="Side Nav Color:"
          selector={
            <Radio.Group
              disabled={isNavTop}
              size="small"
              onChange={(e) => haddleNavStyleChange(e.target.value)}
              value={sideNavTheme}
            >
              <Radio.Button value={SIDE_NAV_LIGHT}>Light</Radio.Button>
              <Radio.Button value={SIDE_NAV_DARK}>Dark</Radio.Button>
            </Radio.Group>
          }
          disabled={isNavTop}
        />
        <ListOption
          name="Side Nav Collapse:"
          selector={
            <Switch
              disabled={isNavTop}
              checked={isCollapse}
              onChange={handleToggleCollapseNav}
            />
          }
          disabled={isNavTop}
        />
        <ListOption
          name="Dark Theme:"
          selector={
            <Switch checked={currentTheme === "dark"} onChange={toggleTheme} />
          }
        />
      </div>
      <div className="mb-5">
        <h4 className="mb-3 font-weight-bold">Locale</h4>
        <ListOption name="Language:" selector={<NavLanguage configDisplay />} />
      </div>
    </>
  );
};

export default ThemeConfigurator;

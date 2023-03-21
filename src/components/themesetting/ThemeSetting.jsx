import React from "react";
import ThemeSettingWrapper from "./themeSetting.style";
import Radium from "radium";
// import Themes from "../../settings/themeConfig";
// import Switcher from "./themeChanger";
// import LanguageSwitcher from "./LanguageSwitcher";
// import config from "settings/languageConfig";
// import IntlMessages from "util/intlMessages";
// import { Scrollbars } from "react-custom-scrollbars";
import { connect } from "react-redux";
import { compose } from "redux";
import actions from "redux/themeSettings/actions";
import { withRouter } from "react-router-dom";
// import { sidebarTransparentData } from "util/data/sidebarTransparentData";
import languageActions from "redux/languageSwitcher/actions";

const { changeLanguage } = languageActions;
const {
  toolbarAlignment,
  footerAlignment,
  toolbarDisplay,
  footerDisplay,
  sidebarTransParent,
  triggerTransparetImage,
  triggerActiveLinkStyle,
  sidebarMini,
  layoutStyle
} = actions;

const ThemeSetting = props => {
  // const toolbarDisplayShow = () => {
  //     props.toolbarDisplay("show");
  // };

  // const toolbarDisplayHide = () => {
  //     props.toolbarDisplay("hide");
  //     if (props.themeSetting.toolbarAlignValue === "above") {
  //         props.toolbarAlignment("below");
  //     }
  // };

  // const toolbarAlignAbove = () => {
  //     props.toolbarAlignment("above");
  //     if (props.themeSetting.toolbarDisplayValue === "hide") {
  //         props.toolbarDisplay("show");
  //     }
  // };

  // const footerDisplayShow = () => {
  //     props.footerDisplay("show");
  // };

  // const footerDisplayHide = () => {
  //     props.footerDisplay("hide");
  //     if (props.themeSetting.footerAlignValue === "above") {
  //         props.footerAlignment("below");
  //     }
  // };

  // const footerAlignAbove = () => {
  //     props.footerAlignment("above");
  //     if (props.themeSetting.footerDisplayValue === "hide") {
  //         props.footerDisplay("show");
  //     }
  // };

  // const resetThemeSettings = () => {
  //     props.changeTheme("sidebarTheme", "gredient1");
  //     props.changeTheme("layoutTheme", "themedefault");
  //     props.changeTheme("footerTheme", "gredient1");
  //     props.changeTheme("topbarTheme", "gredient1");
  //     props.layoutStyle("vertical");
  //     props.changeLanguage("english");
  //     props.footerDisplay("show");
  //     props.toolbarDisplay("show");
  //     props.footerAlignment("below");
  //     props.toolbarAlignment("below");
  //     props.triggerActiveLinkStyle("style1");
  //     props.sidebarMini("off");
  //     props.sidebarTransParent("off");
  // };

  // const changeLanguageHandler = (id) => {
  //     props.changeLanguage(id);
  // };

  const {
    mini,
    // drawerWidth,
    closeSettingDrawer,
    sidebarTheme
    // topbarTheme,
    // layoutTheme,
    // footerTheme,
    // changeTheme,
    // language,
    // themeSetting: { layout },
  } = props;
  // const sidebar = {
  //     width: mini ? 0 : drawerWidth,
  //     "@media (max-width: 575.98px)": {
  //         width: mini ? 0 : drawerWidth,
  //     },
  // };

  return (
    <ThemeSettingWrapper sidebarTheme={sidebarTheme}>
      {!mini && (
        <div
          className="themesetting-overlay"
          onClick={closeSettingDrawer}
        ></div>
      )}
    </ThemeSettingWrapper>
  );
};

const mapStateToProps = state => {
  return {
    themeSetting: {
      toolbarAlignValue: state.themeSetting.toolbarAlignValue,
      footerAlignValue: state.themeSetting.footerAlignValue,
      toolbarDisplayValue: state.themeSetting.toolbarDisplayValue,
      footerDisplayValue: state.themeSetting.footerDisplayValue,
      sidebarTransParentValue: state.themeSetting.sidebarTransParentValue,
      transparentImage: state.themeSetting.transparentImage,
      activeLinkStyle: state.themeSetting.activeLinkStyle,
      sidebarMiniValue: state.themeSetting.sidebarMiniValue,
      layout: state.themeSetting.layout
    },
    language: state.LanguageSwitcher.language
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, {
    toolbarAlignment,
    layoutStyle,
    footerAlignment,
    toolbarDisplay,
    footerDisplay,
    sidebarTransParent,
    triggerTransparetImage,
    triggerActiveLinkStyle,
    sidebarMini,
    changeLanguage
  })
)(Radium(ThemeSetting));

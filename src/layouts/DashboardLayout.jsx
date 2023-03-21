import React, { useState, useRef, useMemo, useEffect, Fragment } from "react";
import Sidebar from "components/sidebar/Sidebar";
import dashboardRoutes from "routes/dashboardRoutes";
import Header from "components/header/Header";
import { drawerWidth, miniDrawerWidth } from "helper/constant";
import { Route, Switch, useLocation, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { ProtectedRoute } from "./../routes/ProtectedRoute";
import GlobalWrapper from "./global.style";
import NavigationActions from "redux/navigation/actions";
import SubscribeDaysRemainingModal from "views/pages/SubscribeDaysRemainingModal";
import { Modal } from "reactstrap";
import { check_permission } from "helper/methods";

const { toggleSubscribeModal, toggleOneTimeModal } = NavigationActions;

const DashboardLayout = props => {
  const {
    user,
    toggleSubscribeModal,
    toggleOneTimeModal,
    subscription,
    oneTimeModal,
    isSubscriptionSuccess
  } = props;
  const location = useLocation();
  const history = useHistory();
  const [mini, setMini] = useState(false);
  // const [themeDrawer, setThemeDrawer] = useState(true);
  const [layoutSettingDrawer, setLayoutSettingDrawer] = useState(true);
  const [statedrawerWidth] = useState(drawerWidth);
  const [groupAndStaus, setGroupAndStatus] = useState({
    group_id: "",
    status_id: ""
  });
  const [stateminiDrawerWidth, setStateminiDrawerWidth] = useState(
    miniDrawerWidth
  );
  const mainPanel = useRef(null);
  const scrollbars = useRef(null);

  useMemo(() => {
    if (scrollbars && scrollbars.current) {
      scrollbars.current.scrollToTop(0);
    }
  }, []);

  let mainPanelWidth;

  const { layoutTheme } = props;

  mainPanelWidth = {
    width: mini
      ? `calc(100% - ${miniDrawerWidth})`
      : `calc(100% - ${drawerWidth})`,
    backgroundColor: layoutTheme.backgroundColor
  };

  const drawerMiniMethod = () => {
    if (mini) {
      setMini(false);
    } else {
      setMini(true);
    }
  };

  const toggleLayoutSettingDrawer = () => {
    setLayoutSettingDrawer(!layoutSettingDrawer);
  };

  const mouseEnter = () => {
    if (mini) {
      setStateminiDrawerWidth(drawerWidth);
    }
  };

  const mouseLeave = () => {
    if (mini) {
      setStateminiDrawerWidth(miniDrawerWidth);
    }
  };

  const closeDrawer = () => {
    setMini(true);
  };

  const checkSubscription = () => {
    if (
      user?.package?.expired &&
      location.pathname !== "/subscription" &&
      location.pathname !== "/profile"
    ) {
      toggleSubscribeModal(true);
    } else {
      toggleSubscribeModal(false);
    }
  };

  useEffect(() => {
    let arr = location.pathname.includes("customer-entries")
      ? location.pathname.split("/")
      : [];
    if (arr.length > 0) {
      setGroupAndStatus({ group_id: arr[2], status_id: arr[3] });
    }
    if (
      user.access_key_send === 1 &&
      location.pathname !== "/change-password"
    ) {
      history.push("/change-password");
    }
    // eslint-disable-next-line
  }, [location.pathname]);

  useEffect(() => {
    if (!isSubscriptionSuccess) {
      checkSubscription();
    }
    // eslint-disable-next-line
  }, [isSubscriptionSuccess]);

  return (
    <Fragment>
      <GlobalWrapper {...props}>
        <Sidebar
          mini={mini}
          drawerWidth={statedrawerWidth}
          miniDrawerWidth={stateminiDrawerWidth}
          onMouseEnter={mouseEnter}
          onMouseLeave={mouseLeave}
          closeDrawer={() => closeDrawer}
          {...props}
        />

        <div
          id="main-panel"
          className="main-panel flex-y"
          ref={mainPanel}
          style={mainPanelWidth}
        >
          <div>
            <Header
              drawerMiniMethod={drawerMiniMethod}
              mini={mini}
              drawerWidth={statedrawerWidth}
              miniDrawerWidth={stateminiDrawerWidth}
              layoutSettingDrawerToggle={toggleLayoutSettingDrawer}
              {...props}
            />
          </div>

          <div className="route-height flex-1 overflow-auto">
            <div
              className={
                user.package?.expired &&
                location.pathname !== "/subscription" &&
                location.pathname !== "/profile"
                  ? "subscription"
                  : null
              }
            >
              <div
                className={
                  user.package?.expired &&
                  location.pathname !== "/subscription" &&
                  location.pathname !== "/profile"
                    ? "subscription"
                    : null
                }
              >
                <Switch>
                  <ProtectedRoute {...props}>
                    {dashboardRoutes.map((prop, key) => {
                      let permission = prop.module
                        ? check_permission(
                            prop.module === "customer_entries"
                              ? `group_${groupAndStaus.group_id}_status_${groupAndStaus.status_id}`
                              : prop.module,
                            "view_permission",
                            user.permissions
                          )
                        : true;

                      return (
                        (user.parent === 0 || permission) && (
                          <Route
                            exact
                            path={prop.path}
                            component={prop.component}
                            key={key}
                          />
                        )
                      );
                    })}
                  </ProtectedRoute>
                </Switch>
              </div>
            </div>
          </div>
        </div>
      </GlobalWrapper>
      {isSubscriptionSuccess ? null : (
        <>
          <Modal centered isOpen={subscription}>
            <SubscribeDaysRemainingModal
              user={user}
              toggleModal={() => toggleSubscribeModal(false)}
            />
          </Modal>

          <Modal centered isOpen={oneTimeModal}>
            <SubscribeDaysRemainingModal
              user={user}
              toggleModal={() => toggleOneTimeModal(false)}
            />
          </Modal>
        </>
      )}
    </Fragment>
  );
};

const mapStateToProps = state => {
  return {
    ...state.themeChanger,
    authData: {
      token: state.auth.accessToken,
      isLogin: state.auth.isLogin
    },
    user: state.auth.user,
    subscription: state.navigation.subscription,
    oneTimeModal: state.navigation.oneTimeModal,
    isSubscriptionSuccess: state.navigation.isSubscriptionSuccess,
    themeSetting: {
      toolbarAlignValue: state.themeSetting.toolbarAlignValue,
      footerAlignValue: state.themeSetting.footerAlignValue,
      sidebarDisplayValue: state.themeSetting.sidebarDisplayValue,
      toolbarDisplayValue: state.themeSetting.toolbarDisplayValue,
      footerDisplayValue: state.themeSetting.footerDisplayValue,
      sidebarTransParentValue: state.themeSetting.sidebarTransParentValue,
      transparentImage: state.themeSetting.transparentImage,
      activeLinkStyle: state.themeSetting.activeLinkStyle,
      sidebarMiniValue: state.themeSetting.sidebarMiniValue,
      layout: state.themeSetting.layout,
      sidebarTransParentActiveBack:
        state.themeSetting.sidebarTransParentActiveBack,
      sidebarTransParentActiveColor:
        state.themeSetting.sidebarTransParentActiveColor
    }
  };
};

export default connect(mapStateToProps, {
  toggleSubscribeModal,
  toggleOneTimeModal
})(DashboardLayout);

import React, { Fragment, useEffect, useState } from "react";
import SidebarWrapper from "./sidebar.style";
import Radium from "radium";
import NavList from "components/sidebar/NavList";
import {
  Home,
  Settings,
  Sliders,
  UserPlus,
  Users,
  Calendar,
  Folder,
  X,
} from "react-feather";
// import sidebarData from "util/data/sidebar";
import { Scrollbars } from "react-custom-scrollbars";
import { NavLink } from "react-router-dom";
import logoImage from "../../assets/images/proctivity_logo.svg";
import { connect } from "react-redux";
import AuthActions from "redux/auth/actions";
import { check_permission } from "../../helper/methods";
import navigationAction from "redux/navigation/actions";
// import { GetGroupStatusHirarchy } from "services/groupsServices";

const { setuser } = AuthActions;
const { getGroupStatusData } = navigationAction;

const Sidebar = props => {
  let listNameStyle;
  let sidebar;
  let sideScrollStyle;

  const {
    mini,
    drawerWidth,
    miniDrawerWidth,
    onMouseEnter,
    onMouseLeave,
    sidebarTheme,
    layoutTheme,
    closeDrawer,
    // themeSetting,
    user,
    token,
    workflowData,
    getGroupStatusData,
    isSubscriptionSuccess
  } = props;

  const [sidebarArr, setSideBarArr] = useState([]);
  const sidebarData = [
    {
      name: "Home",
      routepath: "/Intro",
      icon: <Home />,
      module: "home"
    },
    {
      name: "Add Customer",
      routepath: "/customer-entries/add",
      icon: <UserPlus />,
      module: "customer_add"
    },
    {
      name: "Workflow",
      icon: <Sliders />,
      module: "work",
      child: sidebarArr
    },
    {
      name: "Calendar",
      routepath: "/customer/calendar",
      icon: <Calendar />,
      module: "calendar"
    },
    {
      name: "General Settings",
      icon: <Settings />,
      module: "general_settings",
      child: [
        {
          listname: "Subscription",
          routepath: "/subscription",
          shortname: "SU",
          module: "subscription"
        },
        {
          listname: "Marketing Data",
          routepath: "/marketing-data",
          shortname: "MD",
          module: "marketing_data"
        },
        {
          listname: "Marketing Data List",
          routepath: "/marketing-data-list",
          shortname: "MD",
          module: "marketing_data_list"
        },
        {
          listname: "Groups",
          routepath: "/groups",
          shortname: "GR",
          module: "groups"
        }
      ]
    },
    {
      name: "Users",
      routepath: "/users",
      icon: <Users />,
      module: "users"
    }
  ];

  useEffect(() => {
    token && getGroupStatusData(token);

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    getWorkFlowData();
    // eslint-disable-next-line
  }, [workflowData]);

  const getWorkFlowData = () => {
    setSideBarArr(
      workflowData.map(x => ({
        listname: x.name,
        module: "group_" + x.id,
        icon: <Folder />,
        child: x.child.map(c => ({
          listname: c.name,
          routepath: `/customer-entries/${x.id}/${c.id}/list`,
          shortname: "ST",
          module: "group_" + x.id + "_status_" + c.id
        }))
      }))
    );
    // setGroupStatusHirachy(sideBarArr);
    // sideBarData = sideBarArr;
  };

  sideScrollStyle = {
    zIndex: 5,
    height: "calc(100vh - 130px)"
  };

  // if (
  //     themeSetting.toolbarAlignValue === "above" &&
  //     themeSetting.footerAlignValue === "above"
  // ) {
  //     sideScrollStyle = {
  //         zIndex: 5,
  //         height: "calc(100vh - 190px)",
  //     };
  // } else if (themeSetting.toolbarAlignValue === "above") {
  //     sideScrollStyle = {
  //         zIndex: 5,
  //         height: "calc(100vh - 145px)",
  //     };
  // } else if (themeSetting.footerAlignValue === "above") {
  //     sideScrollStyle = {
  //         zIndex: 5,
  //         height: "calc(100vh - 128px)",
  //     };
  // } else {
  //     sideScrollStyle = {
  //         zIndex: 5,
  //         height: "calc(100vh - 100px)",
  //     };
  // }

  sidebar = {
    width: mini ? miniDrawerWidth : drawerWidth,
    // background: sidebarTheme.backgroundColor,
    background: user.brandcolor,
    "@media (max-width: 991.98px)": {
      width: mini ? 0 : drawerWidth
    }
  };

  // if (themeSetting.sidebarTransParentValue === "on") {
  //     sidebar = {
  //         backgroundImage: `linear-gradient(0deg,rgba(0, 0, 0, 0.8),rgba(0, 0, 0, 0.9)),url(${themeSetting.transparentImage})`,
  //         backgroundRepeat: "no-repeat, repeat",
  //         backgroundPosition: "center",
  //         backgroundSize: "cover",
  //         width: mini ? miniDrawerWidth : drawerWidth,
  //         "@media (max-width: 991.98px)": {
  //             width: mini ? 0 : drawerWidth,
  //         },
  //     };
  // } else {

  // }

  const closeIcon = {
    "@media (max-width: 991.98px)": {
      display: "block"
    }
  };

  if (mini) {
    listNameStyle = {
      opacity: miniDrawerWidth === drawerWidth ? 1 : 0,
      transform:
        miniDrawerWidth === drawerWidth
          ? "translateZ(0)"
          : "translate3d(-25px,0,0)"
    };
  } else {
    listNameStyle = {
      opacity: !mini ? 1 : 0,
      transform: !mini ? "translateZ(0)" : "translate3d(-25px,0,0)"
    };
  }
  const trialNav = {
    whiteSpace: "pre-wrap"
  };

  return (
    <SidebarWrapper
      // themeSetting={themeSetting}
      sidebarTheme={sidebarTheme}
      layoutTheme={layoutTheme}
      mini={mini}
      miniDrawerWidth={miniDrawerWidth}
      drawerWidth={drawerWidth}
    >
      {!mini && <div className="sidebar-overlay" onClick={closeDrawer()}></div>}
      <div
        id="sidebar"
        className="sidebar sideBack"
        style={sidebar}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="sidebar-header">
          <NavLink to={"/"} className="simple-text">
            <div className="logo-img">
              <img src={logoImage} alt="img-fluid react-logo" />
            </div>
          </NavLink>
          {/* <div className="logo-text simple-text fs-20 bold-text">{AppName}</div> */}
        </div>
        <div
          className="close-drawer-icon"
          style={closeIcon}
          onClick={closeDrawer()}
        >
          {/* <i className="fas fa-times-circle" /> */}
          <X />
        </div>
        <Scrollbars
          autoHide
          style={sideScrollStyle}
          renderThumbVertical={({ style, ...props }) => (
            <div {...props} className="sidebar-scrollbar-style" />
          )}
          renderThumbHorizontal={({ style, ...props }) => <div {...props} />}
          renderTrackVertical={({ style, ...props }) => (
            <div
              {...props}
              style={{
                ...style,
                zIndex: 5,
                position: "absolute",
                width: "6px",
                right: "2px",
                bottom: "2px",
                top: "2px",
                borderRadius: "3px"
              }}
            />
          )}
        >
          <div className="sidebar-wrapper">
            <ul className="nav">
              {sidebarData.map((list, i) => {
                let permission = check_permission(
                  list.module,
                  "view_permission",
                  user.permissions
                );
                if (user.parent === 0 || permission) {
                  return (
                    <Fragment key={i}>
                      {list.type && list.type === "heading" ? (
                        (!mini || miniDrawerWidth === drawerWidth) && (
                          <div className="sidelist-header-name">
                            {
                              <Fragment>
                                {/* <IntlMessages
                                                                    id={
                                                                        list.name
                                                                    }
                                                                /> */}
                                {list.name} - 1
                                {list.hasOwnProperty("isNew") && list["isNew"] && (
                                  <span
                                    style={{
                                      right: "23px"
                                    }}
                                    className="new-update-tag fs-13 bold-text"
                                  >
                                    New
                                  </span>
                                )}
                              </Fragment>
                            }
                          </div>
                        )
                      ) : (
                        <NavList
                          listNameStyle={listNameStyle}
                          list={list}
                          mini={mini}
                          miniDrawerWidth={miniDrawerWidth}
                          drawerWidth={drawerWidth}
                          {...props}
                        />
                      )}
                    </Fragment>
                  );
                } else {
                  return <></>;
                }
              })}

              {isSubscriptionSuccess ? null : user?.parent === 0 &&
                Object.keys(user?.package).length === 0 ? (
                <li className="mt-auto">
                  <NavLink
                    to={"/subscription"}
                    className="nav-link main-list active"
                  >
                    {!mini || miniDrawerWidth === drawerWidth ? (
                      <>
                        <p
                          style={{
                            ...listNameStyle,
                            ...trialNav
                          }}
                          className="text-center small"
                        >
                          You are not subscribed to any Plan !
                        </p>
                        <p
                          style={listNameStyle}
                          className="text-center font-weight-bold"
                        >
                          Subscribe Now !
                        </p>
                      </>
                    ) : (
                      <>
                        <i className="fa fa-info" />
                        <p style={listNameStyle}>Info</p>
                      </>
                    )}
                  </NavLink>
                </li>
              ) : user?.parent === 0 && user?.package?.expired ? (
                <li className="mt-auto">
                  <NavLink
                    to={"/subscription"}
                    className="nav-link main-list active"
                  >
                    {!mini || miniDrawerWidth === drawerWidth ? (
                      <>
                        <p
                          style={{
                            ...listNameStyle,
                            ...trialNav
                          }}
                          className="text-center small"
                        >
                          Your package has been
                          <strong> expired</strong>
                        </p>
                        <p
                          style={listNameStyle}
                          className="text-center font-weight-bold"
                        >
                          Subscribe Now !
                        </p>
                      </>
                    ) : (
                      <>
                        <i className="fa fa-info text-danger" />
                        <p style={listNameStyle}>Info</p>
                      </>
                    )}
                  </NavLink>
                </li>
              ) : (user?.parent === 0 &&
                  user?.package?.package_type === "Trial") ||
                (user?.parent === 0 &&
                  user?.package?.package_type !== "Trial" &&
                  user?.package?.difference_in_days <= 5) ? (
                <li className="mt-auto">
                  <NavLink
                    to={"/subscription"}
                    className="nav-link main-list active"
                  >
                    {!mini || miniDrawerWidth === drawerWidth ? (
                      <>
                        <p
                          style={{
                            ...listNameStyle,
                            ...trialNav
                          }}
                          className="text-center small"
                        >
                          <strong>{user.package.difference_in_days}</strong>
                          {` days remaining of your`}{" "}
                          <strong>{user.package.name}</strong>
                        </p>
                        <p
                          style={listNameStyle}
                          className="text-center font-weight-bold"
                        >
                          Start Today!
                        </p>
                      </>
                    ) : (
                      <>
                        <i className="fa fa-info" />
                        <p style={listNameStyle}>Info</p>
                      </>
                    )}
                  </NavLink>
                </li>
              ) : (
                <></>
              )}
            </ul>
          </div>
        </Scrollbars>
      </div>
    </SidebarWrapper>
  );
};

const mapStatetoProps = state => {
  return {
    token: state.auth.accessToken,
    user: state.auth.user,
    workflowData: state.navigation.workflowData,
    isSubscriptionSuccess: state.navigation.isSubscriptionSuccess
  };
};
// export default Radium(Sidebar);
export default connect(mapStatetoProps, { setuser, getGroupStatusData })(
  Radium(Sidebar)
);

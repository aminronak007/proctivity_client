import React, { useState } from "react";
import HeaderWrapper from "./header.style";
import { Modal, Popover, PopoverBody } from "reactstrap";
// import { ProfileLockScreen } from "helper/constant";
import { connect } from "react-redux";
import { compose } from "redux";
import AuthActions from "redux/auth/actions";
import { withRouter } from "react-router-dom";
import ConformationModalUser from "components/common/ConformationModalUser";
import { Menu, MessageSquare } from "react-feather";
import Logout from "assets/images/power.svg";

const { logout } = AuthActions;
const Header = props => {
  const { drawerMiniMethod, mini, token, user, isSubscriptionSuccess } = props;

  const [isOpen, toggleOpen] = useState(false);
  const [openPopover, togglePopover] = useState(false);
  const userSignout = () => {
    toggleOpen(true);
  };
  return (
    <HeaderWrapper {...props}>
      <div className="headerBack">
        <div className="flex-x align-center">
          <div className="drawer-handle-arrow">
            {mini ? (
              <button
                className="top-header-icon"
                onClick={() => drawerMiniMethod()}
              >
                <Menu />
              </button>
            ) : (
              <button
                className="top-header-icon"
                onClick={() => drawerMiniMethod()}
              >
                <Menu />
              </button>
            )}
          </div>
          <div
            className="mini-drawer-menu-icon"
            onClick={() => drawerMiniMethod()}
          >
            <Menu />
            {/* <i className="fas fa-bars" />{" "}
                        <span className="app-name fs-16 bold-text">
                            {"Roe"}
                        </span> */}
          </div>
          {/* <div className="pl-10">
                        <button
                            id="mail"
                            className="top-header-icon"
                        >
                            <i className="far fa-envelope"></i>
                            <div className="button-badge fs-11 demi-bold-text">
                                3
                            </div>
                        </button>
                        <UncontrolledPopover placement="bottom-start" target="mail" className="header-popover" trigger="focus">
                            <PopoverBody className="mail-popover-body">
                                <div className="fs-13 bold-text mb-10">
                                    You have 3 mails.
                                </div>
                                <PopoverBlock
                                    people={friend1}
                                    name="Alex Woods"
                                    text="Hello, How are you ?"
                                    created="Just Now"
                                />
                                <PopoverBlock
                                    people={friend2}
                                    name="James Anderson"
                                    text="Please check your transaction"
                                    created="22nd July 2019"
                                />
                                <PopoverBlock
                                    people={friend3}
                                    name="Watson"
                                    text="You won price.."
                                    created="20th Jun 2019"
                                />
                            </PopoverBody>
                        </UncontrolledPopover>
                    </div> */}
          <div className="pl-3 ml-auto">
            {isSubscriptionSuccess ? null : user?.parent === 0 &&
              Object.keys(user.package).length === 0 ? (
              <p className="small text-white">
                You are not subscribed to any plan
                <strong> Subscribe Now</strong>
              </p>
            ) : user?.parent === 0 && user?.package?.expired ? (
              <p className="small text-white">
                Your package has been
                <strong> expired</strong>
              </p>
            ) : (user?.parent === 0 &&
                user.package?.package_type === "Trial") ||
              (user?.parent === 0 &&
                user.package?.package_type !== "Trial" &&
                user.package?.difference_in_days <= 5) ? (
              <p className="small text-white">
                <strong>{user.package.difference_in_days}</strong>
                {` days remaining of your`} <strong>{user.package.name}</strong>
              </p>
            ) : (
              <></>
            )}
          </div>
          <div className="right-side-icon pl-3">
            <button id="chat" className="top-header-icon">
              <MessageSquare />
            </button>
          </div>
          {/* <div className="right-side-icon pl-3">
            <button id="notification" className="top-header-icon">
              <Bell />
              <div className="button-badge fs-11 demi-bold-text">3</div>
            </button>
          </div> */}
          {/* <div className="pl-3">
                        <button
                            id="notification"
                            className="top-header-icon"
                            onClick={() => props.history.push("/notifications")}
                        >
                            <i className="far fa-bell"></i>
                            <div className="button-badge fs-11 demi-bold-text">
                                3
                            </div>
                        </button>
                    </div> */}
          {/* <div className="pl-10">
                        <button className="top-header-icon">
                            <i className="fas fa-search"></i>
                        </button>
                    </div> */}
          <div className="pl-3">
            <div id="profile">
              <img
                className="top-header-profile-class"
                src={`${process.env.REACT_APP_BACKEND_URI}/${user.logoPath}`}
                alt="notify"
              />
            </div>
            <Popover
              className="roy-menu"
              innerClassName="roy-inner-content"
              placement="bottom-end"
              target="profile"
              trigger="legacy"
              isOpen={openPopover}
              toggle={() => togglePopover(!openPopover)}
            >
              <PopoverBody onClick={() => togglePopover(!openPopover)}>
                <div
                  className="roy-menu-list"
                  onClick={() => props.history.push("/profile")}
                >
                  My Profile
                </div>
                {user.parent === 0 ? (
                  <div
                    className="roy-menu-list"
                    onClick={() => props.history.push("/settings")}
                  >
                    Stripe Settings
                  </div>
                ) : (
                  <></>
                )}
                <div
                  className="roy-menu-list"
                  onClick={() => props.history.push("/change-password")}
                >
                  Change Password
                </div>
                <div className="roy-menu-list" onClick={userSignout}>
                  Logout
                </div>
              </PopoverBody>
            </Popover>
          </div>
          {/* <div className="pl-10">
                        <button
                            onClick={layoutSettingDrawerToggle}
                            className="top-header-icon"
                        >
                            <i className="fas fa-th-large"></i>
                        </button>
                    </div> */}
        </div>
      </div>
      <Modal centered isOpen={isOpen} backdrop={true}>
        {isOpen && (
          <ConformationModalUser
            isOpen={isOpen}
            onClose={() => toggleOpen(false)}
            confirmText={"Logout"}
            message={"Are you sure you want to Logout"}
            handleConfirm={() => props.logout(token)}
            customIcon={Logout}
            titleTxt={"Are you sure you want to logout ?"}
          />
        )}
      </Modal>
    </HeaderWrapper>
  );
};
const mapStateToProps = state => {
  return {
    token: state.auth.accessToken,
    user: state.auth.user,
    isSubscriptionSuccess: state.navigation.isSubscriptionSuccess
  };
};
export default compose(
  withRouter,
  connect(mapStateToProps, { logout })
)(Header);

import React, { useState, useEffect } from "react";
import Radium from "radium";
import { NavLink } from "react-router-dom";
import { Collapse, CardBody, Card } from "reactstrap";
import { ChevronDown, ChevronUp } from "react-feather";
import classNames from "classnames";
import { connect } from "react-redux";
import AuthActions from "redux/auth/actions";
import { check_permission } from "../../helper/methods";
const { setuser } = AuthActions;
const NavSecondChild = props => {
  const [collapse, setCollapse] = useState(false);
  const { user } = props;
  useEffect(() => {
    if (
      props.childList.child.map(a => a.routepath).includes(props.CurrentRoute)
    ) {
      setCollapse(true);
    }
  }, [props.CurrentRoute, props.childList.child]);
  const {
    listNameStyle,
    childList,
    mini,
    drawerWidth,
    miniDrawerWidth,
    CurrentRoute
  } = props;
  const toggle = e => {
    e.preventDefault();
    setCollapse(!collapse);
  };
  return (
    <ul className="p-0">
      <li className="pos-relative">
        {!mini || miniDrawerWidth === drawerWidth ? (
          collapse ? (
            <ChevronUp
              onClick={toggle}
              className={`arrow-sidebar second-child-list-icon ${
                childList.child.map(a => a.routepath).includes(CurrentRoute)
                  ? "active-arrows"
                  : ""
              }`}
            />
          ) : (
            <ChevronDown
              onClick={toggle}
              className={`arrow-sidebar second-child-list-icon ${
                childList.child.map(a => a.routepath).includes(CurrentRoute)
                  ? "active-arrows"
                  : ""
              }`}
            />
          )
        ) : (
          ""
        )}
        <NavLink
          to={"demo"}
          onClick={toggle}
          className={classNames(
            childList.child.map(a => a.routepath).includes(CurrentRoute) &&
              "active",
            "nav-link",
            "main-list"
          )}
        >
          {childList.icon}
          <p style={listNameStyle}>{childList.listname}</p>
        </NavLink>
        <Collapse isOpen={collapse}>
          <Card className="background-transparent border-none">
            <CardBody className="p-0">
              {childList.child
                ? childList.child.map((listData, i) => {
                    let permission = check_permission(
                      listData.module,
                      "view_permission",
                      user.permissions
                    );
                    if (user.parent === 0 || permission) {
                      return (
                        <NavLink
                          to={listData.routepath}
                          className="nav-link child-list"
                          key={i}
                        >
                          <span className="span-shortname">
                            {listData.shortname}
                          </span>
                          <p className="text-capitalize" style={listNameStyle}>
                            {listData.listname}
                          </p>
                        </NavLink>
                      );
                    } else {
                      return <></>;
                    }
                  })
                : ""}
            </CardBody>
          </Card>
        </Collapse>
      </li>
    </ul>
  );
};

const mapStatetoProps = state => {
  return {
    user: state.auth.user
  };
};

export default connect(mapStatetoProps, { setuser })(Radium(NavSecondChild));

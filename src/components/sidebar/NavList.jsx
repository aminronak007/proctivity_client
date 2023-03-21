import React, { Fragment, useState, useEffect } from "react";
import Radium from "radium";
import { NavLink } from "react-router-dom";
import { Collapse, CardBody, Card } from "reactstrap";
import NavSecondChild from "components/sidebar/NavSecondChild";
import classNames from "classnames";
import { ChevronDown, ChevronUp } from "react-feather";
import { connect } from "react-redux";
import AuthActions from "redux/auth/actions";
import { check_permission } from "../../helper/methods";

const { setuser } = AuthActions;

const NavList = props => {
  const [collapse, setCollapse] = useState(false);
  const { user } = props;
  useEffect(() => {
    if (props.list.child) {
      const finalList = props.list.child.filter(
        a => !a.hasOwnProperty("child")
      );
      const threeList = props.list.child.filter(a => a.hasOwnProperty("child"));
      const finalThreelevel = [];
      if (threeList.length) {
        threeList.forEach(element => {
          element.child.forEach(ele => {
            finalThreelevel.push(ele.routepath);
          });
        });
      }
      if (
        (finalList.length &&
          finalList.map(a => a.routepath).includes(props.location.pathname)) ||
        (finalThreelevel && finalThreelevel.includes(props.location.pathname))
      ) {
        setCollapse(true);
      }
    }
  }, [props.list.child, props.location.pathname]);

  const toggle = e => {
    e.preventDefault();
    setCollapse(!collapse);
  };

  let dynamicList;
  const {
    listNameStyle,
    list,
    mini,
    miniDrawerWidth,
    drawerWidth,
    location
  } = props;
  const CurrentRoute = location.pathname;

  if (list.child) {
    const finalList = list.child.filter(a => !a.hasOwnProperty("child"));
    const threeList = list.child.filter(a => a.hasOwnProperty("child"));
    const finalThreelevel = [];
    if (threeList.length) {
      threeList.forEach(element => {
        element.child.forEach(ele => {
          finalThreelevel.push(ele.routepath);
        });
      });
    }
    dynamicList = (
      <li
        className={classNames("pos-relative", collapse && "sidebar-whole-list")}
        onClick={list.onClick && list.onClick}
      >
        {!mini || miniDrawerWidth === drawerWidth ? (
          collapse ? (
            <ChevronUp
              className={classNames(
                ((finalList.length &&
                  finalList.map(a => a.routepath).includes(CurrentRoute)) ||
                  (finalThreelevel &&
                    finalThreelevel.includes(CurrentRoute))) &&
                  "active-arrows",
                "arrow-sidebar"
              )}
              onClick={toggle}
            />
          ) : (
            <ChevronDown
              className={classNames(
                ((finalList.length &&
                  finalList.map(a => a.routepath).includes(CurrentRoute)) ||
                  (finalThreelevel &&
                    finalThreelevel.includes(CurrentRoute))) &&
                  "active-arrows",
                "arrow-sidebar"
              )}
              onClick={toggle}
            />
          )
        ) : (
          ""
        )}
        <NavLink
          to={"/demo"}
          onClick={toggle}
          className={classNames(
            ((finalList.length &&
              finalList.map(a => a.routepath).includes(CurrentRoute)) ||
              (finalThreelevel && finalThreelevel.includes(CurrentRoute))) &&
              "active",
            "nav-link",
            "main-list"
          )}
        >
          {list.icon}
          <p style={listNameStyle}>
            {list.name}
            {list.hasOwnProperty("isNew") && list["isNew"] && (
              <span
                style={{ right: "23px" }}
                className="new-update-tag fs-13 bold-text"
              >
                New
              </span>
            )}
          </p>
        </NavLink>
        <Collapse isOpen={collapse}>
          <Card className="background-transparent border-none">
            <CardBody className={classNames("p-0")}>
              {list.child
                ? list.child.map((childList, i) => {
                    let permission = check_permission(
                      childList.module,
                      "view_permission",
                      user.permissions
                    );
                    if (user.parent === 0 || permission) {
                      return (
                        <Fragment key={i}>
                          {childList.child ? (
                            <NavSecondChild
                              CurrentRoute={CurrentRoute}
                              listNameStyle={listNameStyle}
                              childList={childList}
                              mini={mini}
                              miniDrawerWidth={miniDrawerWidth}
                              drawerWidth={drawerWidth}
                            />
                          ) : (
                            <NavLink
                              to={childList.routepath}
                              className="nav-link child-list"
                              key={i}
                              onClick={() =>
                                childList.onClick && childList.onClick()
                              }
                            >
                              <span className="span-shortname">
                                {childList.shortname}{" "}
                              </span>
                              <p style={listNameStyle}>
                                {childList.listname}
                                {childList.hasOwnProperty("isNew") &&
                                  childList["isNew"] && (
                                    <span className="new-update-tag fs-13 bold-text">
                                      New
                                    </span>
                                  )}
                              </p>
                            </NavLink>
                          )}
                        </Fragment>
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
    );
  } else {
    dynamicList = (
      <li>
        <NavLink to={list.routepath} className="nav-link main-list">
          {list.icon}
          <p style={listNameStyle}>
            {list.name}
            {list.hasOwnProperty("isNew") && list["isNew"] && (
              <span className="new-update-tag fs-13 bold-text">New</span>
            )}
          </p>
        </NavLink>
      </li>
    );
  }

  return <Fragment>{dynamicList}</Fragment>;
};

const mapStatetoProps = state => {
  return {
    user: state.auth.user
  };
};

export default connect(mapStatetoProps, { setuser })(Radium(NavList));

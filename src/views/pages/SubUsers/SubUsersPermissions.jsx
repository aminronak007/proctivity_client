import React, { useState, useEffect, Fragment } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import classNames from "classnames";
import {
  GetUserPermissions,
  GetUserGroupPermissions,
  CreateOrUpdatePermissions
} from "services/subUsersServices";
import NavigationActions from "redux/navigation/actions";
import { compose } from "redux";
import AuthActions from "redux/auth/actions";
import { useParams } from "react-router-dom";
import { viewSubUser } from "services/subUsersServices";
import { Eye, Edit3, Slash, ArrowRight } from "react-feather";
import BackButton from "components/common/BackButton";

const { success, error, fetching } = NavigationActions;
const { setuser } = AuthActions;

const SubUsersPermissions = props => {
  const { token, success, error, fetching, user } = props;
  const [UserModules, SetUserModules] = useState([]);
  const [UserGroupModules, SetGroupUserModules] = useState([]);
  const [subUserDetails, setSubUserDetails] = useState({});
  const { id } = useParams();

  const loadSubUserDetails = async () => {
    fetching();
    await viewSubUser(token, id).then(data => {
      if (data.success) {
        setSubUserDetails(data.data);
        success();
      } else {
        error();
      }
    });
  };

  useEffect(() => {
    loadSubUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (id !== undefined || id !== "") {
      GetUserPermissions(token, {
        user_id: id,
        table_prefix: user.table_prefix
      }).then(data => {
        if (data.success) {
          SetUserModules(data.data);
        } else {
          error(data.message);
        }
      });

      GetUserGroupPermissions(token, {
        user_id: id,
        table_prefix: user.table_prefix
      }).then(data => {
        if (data.success) {
          SetGroupUserModules(data.data);
        } else {
          error(data.message);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCheckbox = data => {
    if (data.view_permission == null) data.view_permission = 0;
    if (data.access_permission == null) data.access_permission = 0;
    if (data.edit_permission == null) data.edit_permission = 0;
    CreateOrUpdatePermissions(token, {
      user_id: id,
      table_prefix: user.table_prefix,
      module: data.module_code,
      view_permission: data.view_permission,
      access_permission: data.access_permission,
      edit_permission: data.edit_permission
    }).then(data => {
      if (data.success) {
        success();
      } else {
        error(data.message);
      }
    });
  };
  let counter = 0;

  return (
    <div className="container-fluid">
      <div className="row title-sec align-items-center">
        <div className="col-sm headline">Permissions</div>
        <div className="col-sm-auto ml-auto">
          <BackButton history={props.history} />
        </div>
      </div>
      <div className="div-container">
        <div className="row subscribe-card-row pb-3">
          <div className="col-12">
            <div className="grey-box">
              <div className="row">
                <div className="col-6">
                  <label className="font-weight-bold">
                    Username:{" "}
                    <span className="font-weight-normal">
                      {subUserDetails.username}
                    </span>
                  </label>
                </div>

                <div className="col-6 mb-2">
                  <label className="font-weight-bold">
                    Role:{" "}
                    <span className="font-weight-normal">
                      {subUserDetails.role}
                    </span>
                  </label>
                </div>
                <div className="col-6">
                  <label className="font-weight-bold">
                    Email:{" "}
                    <span className="font-weight-normal">
                      {subUserDetails.email}
                    </span>
                  </label>
                </div>
                <div className="col-6">
                  <label className="font-weight-bold">
                    Mobile:{" "}
                    <span className="font-weight-normal">
                      {subUserDetails.phone}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <table className={classNames("table")}>
          <thead className={"thead-dark"}>
            <tr>
              <th>Sr No.</th>
              <th>Module Name</th>
              <th>
                <Eye />
                &nbsp;&nbsp;View
              </th>
              <th>
                <Edit3 />
                &nbsp;&nbsp;Edit (Add + Edit + Delete)
              </th>
              <th>
                <Slash />
                &nbsp;&nbsp;No Access
              </th>
            </tr>
          </thead>

          <tbody>
            {UserModules &&
              UserModules.map((row, index) => {
                counter++;
                return (
                  <tr key={counter}>
                    <td>{counter}</td>
                    <td>{row.name}</td>
                    <td>
                      <div className="pretty p-svg p-curve">
                        <input
                          type="checkbox"
                          name={`view_permission_${index}`}
                          checked={
                            row.view_permission && row.view_permission === 1
                              ? true
                              : false
                          }
                          value={
                            row.view_permission && row.view_permission === 1
                              ? true
                              : false
                          }
                          onChange={e => {
                            UserModules[index].view_permission = e.target
                              .checked
                              ? 1
                              : 0;
                            if (e.target.checked) {
                              UserModules[index].edit_permission = 0;
                              UserModules[index].access_permission = 0;
                            }
                            SetUserModules([...UserModules]);
                            handleCheckbox(UserModules[index]);
                          }}
                        />
                        <div className="state p-primary">
                          <svg className="svg svg-icon" viewBox="0 0 20 20">
                            <path
                              d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z"
                              style={{
                                stroke: "white",
                                fill: "white"
                              }}
                            ></path>
                          </svg>
                          <label>&nbsp;</label>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="pretty p-svg p-curve">
                        <input
                          type="checkbox"
                          name={`edit_permission_${index}`}
                          checked={
                            row.edit_permission && row.edit_permission === 1
                              ? true
                              : false
                          }
                          value={
                            row.edit_permission && row.edit_permission === 1
                              ? true
                              : false
                          }
                          onChange={e => {
                            UserModules[index].edit_permission = e.target
                              .checked
                              ? 1
                              : 0;
                            if (e.target.checked) {
                              UserModules[index].access_permission = 0;
                              UserModules[index].view_permission = 1;
                            }
                            SetUserModules([...UserModules]);
                            handleCheckbox(UserModules[index]);
                          }}
                        />

                        <div className="state p-primary">
                          <svg className="svg svg-icon" viewBox="0 0 20 20">
                            <path
                              d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z"
                              style={{
                                stroke: "white",
                                fill: "white"
                              }}
                            ></path>
                          </svg>
                          <label>&nbsp;</label>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="pretty p-svg p-curve">
                        <input
                          type="checkbox"
                          name={`access_permission_${index}`}
                          checked={
                            row.access_permission && row.access_permission === 1
                              ? true
                              : false
                          }
                          value={
                            row.access_permission && row.access_permission === 1
                              ? true
                              : false
                          }
                          onChange={e => {
                            UserModules[index].access_permission = e.target
                              .checked
                              ? 1
                              : 0;
                            if (e.target.checked) {
                              UserModules[index].edit_permission = 0;
                              UserModules[index].view_permission = 0;
                            }
                            SetUserModules([...UserModules]);
                            handleCheckbox(UserModules[index]);
                          }}
                        />

                        <div className="state p-primary">
                          <svg className="svg svg-icon" viewBox="0 0 20 20">
                            <path
                              d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z"
                              style={{
                                stroke: "white",
                                fill: "white"
                              }}
                            ></path>
                          </svg>
                          <label>&nbsp;</label>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}

            {UserGroupModules &&
              UserGroupModules.map((row, index) => {
                counter++;
                return (
                  <Fragment key={"group_" + row.id}>
                    <tr key={counter}>
                      <td>{counter}</td>
                      <td>{row.name}</td>
                      <td>
                        <div className="pretty p-svg p-curve">
                          <input
                            type="checkbox"
                            name={`view_permission_${index}`}
                            checked={
                              row.view_permission && row.view_permission === 1
                                ? true
                                : false
                            }
                            value={
                              row.view_permission && row.view_permission === 1
                                ? true
                                : false
                            }
                            onChange={e => {
                              UserGroupModules[index].view_permission = e.target
                                .checked
                                ? 1
                                : 0;
                              if (e.target.checked) {
                                UserGroupModules[index].edit_permission = 0;
                                UserGroupModules[index].access_permission = 0;
                              }
                              SetGroupUserModules([...UserGroupModules]);
                              handleCheckbox(UserGroupModules[index]);
                            }}
                          />
                          <div className="state p-primary">
                            <svg className="svg svg-icon" viewBox="0 0 20 20">
                              <path
                                d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z"
                                style={{
                                  stroke: "white",
                                  fill: "white"
                                }}
                              ></path>
                            </svg>
                            <label>&nbsp;</label>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="pretty p-svg p-curve">
                          <input
                            type="checkbox"
                            name={`edit_permission_${index}`}
                            checked={
                              row.edit_permission && row.edit_permission === 1
                                ? true
                                : false
                            }
                            value={
                              row.edit_permission && row.edit_permission === 1
                                ? true
                                : false
                            }
                            onChange={e => {
                              UserGroupModules[index].edit_permission = e.target
                                .checked
                                ? 1
                                : 0;
                              if (e.target.checked) {
                                UserGroupModules[index].access_permission = 0;
                                UserGroupModules[index].view_permission = 1;
                              }
                              SetGroupUserModules([...UserGroupModules]);
                              handleCheckbox(UserGroupModules[index]);
                            }}
                          />

                          <div className="state p-primary">
                            <svg className="svg svg-icon" viewBox="0 0 20 20">
                              <path
                                d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z"
                                style={{
                                  stroke: "white",
                                  fill: "white"
                                }}
                              ></path>
                            </svg>
                            <label>&nbsp;</label>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="pretty p-svg p-curve">
                          <input
                            type="checkbox"
                            name={`access_permission_${index}`}
                            checked={
                              row.access_permission &&
                              row.access_permission === 1
                                ? true
                                : false
                            }
                            value={
                              row.access_permission &&
                              row.access_permission === 1
                                ? true
                                : false
                            }
                            onChange={e => {
                              UserGroupModules[index].access_permission = e
                                .target.checked
                                ? 1
                                : 0;
                              if (e.target.checked) {
                                UserGroupModules[index].edit_permission = 0;
                                UserGroupModules[index].view_permission = 0;
                              }
                              SetGroupUserModules([...UserGroupModules]);
                              handleCheckbox(UserGroupModules[index]);
                            }}
                          />

                          <div className="state p-primary">
                            <svg className="svg svg-icon" viewBox="0 0 20 20">
                              <path
                                d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z"
                                style={{
                                  stroke: "white",
                                  fill: "white"
                                }}
                              ></path>
                            </svg>
                            <label>&nbsp;</label>
                          </div>
                        </div>
                      </td>
                    </tr>
                    {row.child.map((row_ch, child_index) => {
                      counter++;
                      return (
                        <tr
                          key={"group_" + row.id + "status_" + row_ch.id}
                          className={"thead-dark"}
                        >
                          <td>{counter}</td>
                          <td>
                            {" "}
                            <ArrowRight />
                            {row_ch.name}
                          </td>
                          <td>
                            <div className="pretty p-svg p-curve">
                              <input
                                type="checkbox"
                                name={`view_permission_${index}`}
                                checked={
                                  row_ch.view_permission &&
                                  row_ch.view_permission === 1
                                    ? true
                                    : false
                                }
                                value={
                                  row_ch.view_permission &&
                                  row_ch.view_permission === 1
                                    ? true
                                    : false
                                }
                                onChange={e => {
                                  UserGroupModules[index].child[
                                    child_index
                                  ].view_permission = e.target.checked ? 1 : 0;
                                  if (e.target.checked) {
                                    UserGroupModules[index].child[
                                      child_index
                                    ].edit_permission = 0;
                                    UserGroupModules[index].child[
                                      child_index
                                    ].access_permission = 0;
                                  }
                                  SetGroupUserModules([...UserGroupModules]);
                                  handleCheckbox(
                                    UserGroupModules[index].child[child_index]
                                  );
                                }}
                              />
                              <div className="state p-primary">
                                <svg
                                  className="svg svg-icon"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z"
                                    style={{
                                      stroke: "white",
                                      fill: "white"
                                    }}
                                  ></path>
                                </svg>
                                <label>&nbsp;</label>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="pretty p-svg p-curve">
                              <input
                                type="checkbox"
                                name={`view_permission_${index}`}
                                checked={
                                  row_ch.edit_permission &&
                                  row_ch.edit_permission === 1
                                    ? true
                                    : false
                                }
                                value={
                                  row_ch.edit_permission &&
                                  row_ch.edit_permission === 1
                                    ? true
                                    : false
                                }
                                onChange={e => {
                                  UserGroupModules[index].child[
                                    child_index
                                  ].edit_permission = e.target.checked ? 1 : 0;
                                  if (e.target.checked) {
                                    UserGroupModules[index].child[
                                      child_index
                                    ].access_permission = 0;
                                    UserGroupModules[index].child[
                                      child_index
                                    ].view_permission = 1;
                                  }
                                  SetGroupUserModules([...UserGroupModules]);
                                  handleCheckbox(
                                    UserGroupModules[index].child[child_index]
                                  );
                                }}
                              />
                              <div className="state p-primary">
                                <svg
                                  className="svg svg-icon"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z"
                                    style={{
                                      stroke: "white",
                                      fill: "white"
                                    }}
                                  ></path>
                                </svg>
                                <label>&nbsp;</label>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="pretty p-svg p-curve">
                              <input
                                type="checkbox"
                                name={`view_permission_${index}`}
                                checked={
                                  row_ch.access_permission &&
                                  row_ch.access_permission === 1
                                    ? true
                                    : false
                                }
                                value={
                                  row_ch.access_permission &&
                                  row_ch.access_permission === 1
                                    ? true
                                    : false
                                }
                                onChange={e => {
                                  UserGroupModules[index].child[
                                    child_index
                                  ].access_permission = e.target.checked
                                    ? 1
                                    : 0;
                                  if (e.target.checked) {
                                    UserGroupModules[index].child[
                                      child_index
                                    ].edit_permission = 0;
                                    UserGroupModules[index].child[
                                      child_index
                                    ].view_permission = 0;
                                  }
                                  SetGroupUserModules([...UserGroupModules]);
                                  handleCheckbox(
                                    UserGroupModules[index].child[child_index]
                                  );
                                }}
                              />
                              <div className="state p-primary">
                                <svg
                                  className="svg svg-icon"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z"
                                    style={{
                                      stroke: "white",
                                      fill: "white"
                                    }}
                                  ></path>
                                </svg>
                                <label>&nbsp;</label>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </Fragment>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    ...state.themeChanger,
    token: state.auth.accessToken,
    user: state.auth.user
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, { success, error, fetching, setuser })
)(SubUsersPermissions);

import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import Pagination from "components/common/Pagination";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import ReactTableWrapper from "components/reacttable/reacttbl.style";
import classnames from "classnames";
import {
  deleteSubUser,
  getSubUsers,
  sendAccessKey,
  updateSubUserStatus
} from "services/subUsersServices";
import NavigationActions from "redux/navigation/actions";
import { compose } from "redux";
import AuthActions from "redux/auth/actions";
import { Modal } from "reactstrap";
import UsersAddModal from "./SubUsersAddModal";
import ConformationModalUser from "components/common/ConformationModalUser";
import { Trash, Edit3, Plus, Key } from "react-feather";

import { Link } from "react-router-dom";
import { check_permission, GetTheTime } from "../../../helper/methods";
import TableLoader from "components/common/TableLoaders";
import Select from "react-select";
import AccessKey from "assets/images/key.svg";
import Warning from "assets/images/alert-circle.svg";

const { success, error, fetching } = NavigationActions;
const { setuser } = AuthActions;

let debounceTimer;

const HeaderComponent = props => {
  let classes = {
    "-sort-asc": props.isSortedDesc !== undefined && !props.isSortedDesc,
    "-sort-desc": props.isSortedDesc !== undefined && props.isSortedDesc
  };
  return <div className={classnames(classes)}>{props.title}</div>;
};

const Users = props => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageLength, setPageLength] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [sortObject, setSortObject] = useState({ id: "id", desc: false });
  const { token, success, error, fetching, user, isFetching } = props;

  const [isOpen, setOpenModal] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const [refresh, toggleRefresh] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [totalRecords, setTotalRecords] = useState("0");
  const [confirmProps, setConfirmProps] = useState({
    isOpen: false,
    confirmText: "",
    confirmMessage: ""
  });
  const pageOptions = [
    { value: 5, label: 5 },
    { value: 10, label: 10 },
    { value: 25, label: 25 },
    { value: 50, label: 50 },
    { value: 100, label: 100 }
  ];

  const [addLoader, setAddLoader] = useState(false);

  const closeConfrimModal = () =>
    setConfirmProps({
      isOpen: false,
      confirmText: "",
      confirmMessage: ""
    });

  const updateStatus = data => {
    setAddLoader(true);
    updateSubUserStatus(token, data).then(data => {
      if (data.success) {
        success(data.message);
        setAddLoader(false);
        closeConfrimModal();
        toggleRefresh(true);
      } else {
        error(data.message);
      }
    });
  };

  const deleteClick = id => {
    setAddLoader(true);
    deleteSubUser(token, id).then(res => {
      if (res.success) {
        success(res.message);
        setAddLoader(false);
        closeConfrimModal();
        toggleRefresh(true);
      } else {
        error(res.message);
      }
    });
  };

  const sendAccessKeyToUser = id => {
    setAddLoader(true);
    sendAccessKey(token, id).then(data => {
      if (data.success) {
        success(data.message);
        setAddLoader(false);
        closeConfrimModal();
      } else {
        error(data.message);
        setAddLoader(false);
      }
    });
  };

  const columns = useMemo(
    () => [
      {
        Header: tableInstance => {
          return (
            <HeaderComponent
              isSortedDesc={tableInstance.column.isSortedDesc}
              title="Sr No."
            />
          );
        },
        placeholder: "",
        disableFilters: true,
        accessor: "id",
        Cell: tableInstance =>
          tableInstance.row.index + 1 + currentPage * pageLength
      },
      {
        Header: tableInstance => {
          return (
            <HeaderComponent
              isSortedDesc={tableInstance.column.isSortedDesc}
              title="Full Name"
            />
          );
        },
        placeholder: "Full Name",
        disableFilters: true,
        accessor: "username",
        Cell: tableInstance => (
          <span className="text-capitalize">
            {tableInstance.row.values.username}
          </span>
        )
      },
      {
        Header: tableInstance => {
          return (
            <HeaderComponent
              isSortedDesc={tableInstance.column.isSortedDesc}
              title="Email"
            />
          );
        },
        placeholder: "Email",
        disableFilters: true,
        accessor: "email"
      },
      {
        Header: tableInstance => {
          return (
            <HeaderComponent
              isSortedDesc={tableInstance.column.isSortedDesc}
              title="Mobile"
            />
          );
        },
        placeholder: "Mobile",
        disableFilters: true,
        accessor: "phone"
      },
      {
        Header: tableInstance => {
          return (
            <HeaderComponent
              isSortedDesc={tableInstance.column.isSortedDesc}
              title="Role"
            />
          );
        },
        placeholder: "Role",
        disableFilters: true,
        accessor: "role"
      },
      {
        Header: tableInstance => {
          return (
            <HeaderComponent
              isSortedDesc={tableInstance.column.isSortedDesc}
              title="Date of Onboarding"
            />
          );
        },
        placeholder: "Created At",
        disableFilters: true,
        accessor: "created_at",
        Cell: tableInstance => GetTheTime(tableInstance.value)
      },
      {
        Header: tableInstance => {
          return (
            <HeaderComponent
              isSortedDesc={tableInstance.column.isSortedDesc}
              title="Permission"
            />
          );
        },
        placeholder: "Permission",
        disableSortBy: true,
        disableFilters: true,
        accessor: "permission",
        Cell: tableInstance => (
          <div className="react-action-class">
            <Link
              className="table-action action-permission text-decoration-none p-1"
              to={`/users/permissions/${tableInstance.row.original.id}`}
            >
              Permission
            </Link>
          </div>
        )
      },
      {
        Header: tableInstance => {
          return (
            <HeaderComponent
              isSortedDesc={tableInstance.column.isSortedDesc}
              title="Status"
            />
          );
        },
        placeholder: "Status",
        disableSortBy: true,
        disableFilters: true,
        accessor: "status",
        Cell: tableInstance => (
          <div className="pretty p-switch p-fill">
            <input
              type="checkbox"
              checked={tableInstance.value === "active"}
              value={tableInstance.value === "active" ? "active" : "inactive"}
              onChange={() => {
                setConfirmProps({
                  isOpen: true,
                  confirmText: "Change",
                  confirmMessage: `Would you like to ${
                    tableInstance.value === "active" ? "deactivate" : "activate"
                  } the user ?`,
                  handleConfirm: () =>
                    updateStatus({
                      id: tableInstance.row.original.id,
                      status:
                        tableInstance.value === "inactive"
                          ? "active"
                          : "inactive"
                    }),
                  customIcon: Warning
                });
              }}
              disabled={user.parent === 0 || permission ? false : true}
            />
            <div className="state">
              <label></label>
            </div>
          </div>
        )
      },
      {
        Header: tableInstance => {
          return (
            <HeaderComponent
              isSortedDesc={tableInstance.column.isSortedDesc}
              title="Action"
            />
          );
        },
        accessor: "updated_at",
        disableSortBy: true,
        disableFilters: true,
        Cell: tableInstance => {
          return (
            <div className="react-action-class">
              <button
                className="table-action action-edit"
                onClick={() => {
                  setConfirmProps({
                    isOpen: true,
                    confirmText: "Send",
                    confirmMessage:
                      "The access key (credential) will be sent to the registered Email ID",
                    handleConfirm: () =>
                      sendAccessKeyToUser({
                        id: tableInstance.row.original.id
                      }),
                    customIcon: AccessKey
                  });
                }}
                disabled={user.parent === 0 || permission ? false : true}
              >
                <Key className="table-icon-edit" />
              </button>

              <button
                className="table-action action-edit"
                onClick={() => {
                  setEditData(tableInstance.row.original);
                  setIsEdit(true);
                  setOpenModal(true);
                }}
                disabled={user.parent === 0 || permission ? false : true}
              >
                <Edit3 className="table-icon-edit" />
              </button>

              <button
                className="table-action action-delete"
                onClick={() => {
                  setConfirmProps({
                    isOpen: true,
                    confirmText: "Delete",
                    confirmMessage:
                      "Are you sure you want to delete the user ?",
                    handleConfirm: () =>
                      deleteClick(tableInstance.row.original.id)
                  });
                  // setDeleteID();
                }}
                disabled={user.parent === 0 || permission ? false : true}
              >
                <Trash className="table-icon-edit" />
              </button>
            </div>
          );
        }
      }
    ],
    // eslint-disable-next-line
    [currentPage]
  );

  const {
    getTableProps,
    getTableBodyProps,
    prepareRow,
    rows,
    headerGroups,
    state: { sortBy }
  } = useTable(
    {
      data: usersList,
      columns: columns,
      manualSortBy: true,
      initialState: {
        pageSize: pageLength,
        pageIndex: 0
      }
    },
    useSortBy,
    usePagination
  );

  const callApi = useCallback(async () => {
    const params = {
      page: currentPage + 1,
      limit: pageLength,
      search: searchText,
      sort_on: sortObject.id ? sortObject.id : "id",
      sort: sortObject.desc ? "desc" : "asc"
      // sortBy: sortObject,
    };

    await getSubUsers(token, user.id, params).then(data => {
      fetching();
      if (data.success) {
        setUsersList(data.data.users);
        setTotalRecords(data.data.totalRecords);
        setTotalPage(Math.ceil(data.data.totalRecords / pageLength));
        toggleRefresh(false);
        success();
      } else {
        error(data.message);
      }
    });
    // eslint-disable-next-line
  }, [currentPage, pageLength, sortObject, searchText, refresh]);

  useEffect(() => {
    // Call api here
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }
    debounceTimer = setTimeout(() => {
      // setPageLength(10);
      callApi();
    }, 1000);
  }, [currentPage, searchText, sortObject, callApi]);

  useEffect(() => {
    // Call api here
    setCurrentPage(0);
  }, [searchText, sortObject, pageLength]);

  useEffect(() => {
    setSortObject({ ...sortBy[0] });
  }, [sortBy]);

  const handlePageChange = page => {
    fetching();
    setCurrentPage(page);
  };
  let permission = check_permission(
    "users",
    "edit_permission",
    user.permissions
  );

  return (
    <>
      <div className="container-fluid">
        <div className="row title-sec align-items-center">
          <div className="col-sm headline">Users</div>
          <div className="col-sm-auto ml-auto"></div>
        </div>

        <div className="div-container">
          <ReactTableWrapper {...props}>
            <div className="row title-sec align-items-center">
              <div className="col-md">
                <label className="mr-2">Results</label>
                <Select
                  id="pagination"
                  className="page-result"
                  value={pageOptions.find(x => x.value === pageLength)}
                  onChange={e => setPageLength(e.value)}
                  options={pageOptions}
                />
              </div>
              <div className="col-md-auto ml-auto mt-3 mt-md-0">
                <div className="row justify-content-end">
                  <div className="col-sm-auto">
                    <input
                      value={searchText ? searchText : ""}
                      onChange={e => setSearchText(e.target.value)}
                      type="text"
                      placeholder="Search.."
                      className="fs-14 medium-text plr-10 form-control field-sm react-form-input"
                    />
                  </div>

                  {user.package.package_type === undefined ||
                  user.package.package_type === "Trial" ? (
                    <></>
                  ) : (
                    <div className="col-sm-auto pl-sm-0">
                      <button
                        className="btn btn-blue"
                        onClick={() => {
                          setConfirmProps({
                            isOpen: true,
                            confirmText: "Add User",
                            confirmMessage: `On adding a user, $${user?.package?.monthly_price_per_user} will be deducted and the same will be added to your upcoming invoice.`,
                            handleConfirm: () => {
                              setOpenModal(true);
                              closeConfrimModal();
                            },
                            customIcon: Warning
                          });
                        }}
                        disabled={
                          user.parent === 0 || permission ? false : true
                        }
                      >
                        <Plus className="mr-2" /> Add User
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* <div className="row title-sec align-items-center">
                            <div className="col-sm headline"></div>
                            <div className="col-sm-auto ml-auto">
                                <input
                                    value={searchText ? searchText : ""}
                                    onChange={(e) =>
                                        setSearchText(e.target.value)
                                    }
                                    type="text"
                                    placeholder="Search.."
                                    className="fs-14 medium-text plr-10 form-control react-form-input"
                                />
                            </div>
                        </div> */}

            <div className="table-responsive common-table">
              <table className="table border-0" {...getTableProps()}>
                <thead className="thead-dark">
                  {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map(header => (
                        <th
                          {...header.getHeaderProps(
                            header.getSortByToggleProps()
                          )}
                        >
                          <div>{header.render("Header")}</div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {isFetching ? (
                    <TableLoader colspan={columns?.length} />
                  ) : rows.length > 0 ? (
                    rows.map(row => {
                      prepareRow(row);
                      return (
                        <tr {...row.getRowProps()}>
                          {row.cells.map(cell => (
                            <td {...cell.getCellProps()}>
                              {cell.render("Cell")}
                            </td>
                          ))}
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={columns?.length}>
                        <h6>No Data Found</h6>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="row align-items-center table-footer">
              <div className="col-sm-6 text-center text-sm-left">
                <span className="total-entry">
                  Showing{" "}
                  {totalRecords === 0 ? 0 : currentPage * pageLength + 1} to{" "}
                  {usersList.length < pageLength
                    ? totalRecords
                    : currentPage * pageLength + pageLength}{" "}
                  of {totalRecords} entries
                </span>
              </div>
              <div className="col-sm-6">
                <Pagination
                  onPageChange={handlePageChange}
                  pages={totalPage}
                  page={currentPage}
                />
              </div>
            </div>

            <Modal centered isOpen={isOpen} backdrop={true}>
              {isOpen && (
                <UsersAddModal
                  onClose={() => {
                    setOpenModal(false);
                    setIsEdit(false);
                    setEditData({});
                  }}
                  isEdit={isEdit}
                  editData={editData}
                  toggleRefresh={e => toggleRefresh(e)}
                />
              )}
            </Modal>
          </ReactTableWrapper>
        </div>
      </div>
      <Modal centered isOpen={confirmProps.isOpen} backdrop={true}>
        {confirmProps.isOpen && (
          <ConformationModalUser
            isOpen={confirmProps.isOpen}
            onClose={() => closeConfrimModal()}
            confirmText={confirmProps.confirmText}
            message={confirmProps.confirmMessage}
            handleConfirm={confirmProps.handleConfirm}
            addLoader={addLoader}
            customIcon={confirmProps.customIcon}
          />
        )}
      </Modal>
    </>
  );
};

const mapStateToProps = state => {
  return {
    ...state.themeChanger,
    token: state.auth.accessToken,
    user: state.auth.user,
    isFetching: state.navigation.isFetching
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, { success, error, fetching, setuser })
)(Users);

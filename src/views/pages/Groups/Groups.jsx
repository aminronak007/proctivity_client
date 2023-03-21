import React, { useCallback, useEffect, useMemo, useState } from "react";
import NavigationActions from "redux/navigation/actions";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import AuthActions from "redux/auth/actions";
import { Modal } from "reactstrap";
import GroupsAddModal from "./GroupsAddModal";
import ReactTableWrapper from "components/reacttable/reacttbl.style";
import classNames from "classnames";
import { useTable, useSortBy, useFilters, usePagination } from "react-table";
import Pagination from "components/common/Pagination";
import { getGroups, deleteGroup } from "services/groupsServices";
import ConformationModalUser from "components/common/ConformationModalUser";
import { Edit3, Plus, Trash } from "react-feather";
import { check_permission } from "../../../helper/methods";
import TableLoader from "components/common/TableLoaders";

const { success, error, fetching, getGroupStatusData } = NavigationActions;
const { setuser } = AuthActions;
const Groups = props => {
  const {
    token,
    success,
    error,
    fetching,
    user,
    isFetching,
    getGroupStatusData
  } = props;
  const [isOpen, setOpenModal] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const [refresh, toggleRefresh] = useState(true);
  const [groupsList, setGroupsList] = useState([]);
  const [openDeleteModal, toggleDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteID] = useState("");
  let permission = check_permission(
    "groups",
    "edit_permission",
    user.permissions
  );
  const HeaderComponent = props => {
    let classes = {
      "-sort-asc": props.isSortedDesc !== undefined && !props.isSortedDesc,
      "-sort-desc": props.isSortedDesc !== undefined && props.isSortedDesc
    };
    return <div className={classNames(classes)}>{props.title}</div>;
  };

  const getGroupsData = useCallback(async () => {
    fetching();
    await getGroups(token).then(data => {
      if (data.success) {
        setGroupsList(data.data);
        toggleRefresh(false);
        success();
      } else {
        error(data.message);
      }
    });

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (refresh) {
      getGroupsData();
    }
    // eslint-disable-next-line
  }, [refresh]);

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
        placeholder: "Serial Number",
        disableFilters: true,
        accessor: "no",
        Cell: tableInstance => (
          <span className="text-capitalize">
            {parseInt(tableInstance.row.id) + 1}
          </span>
        )
      },
      {
        Header: tableInstance => {
          return (
            <HeaderComponent
              isSortedDesc={tableInstance.column.isSortedDesc}
              title="Group Name"
            />
          );
        },
        placeholder: "Group Name",
        disableFilters: true,
        accessor: "name",
        Cell: tableInstance => (
          <span className="text-capitalize">{tableInstance.value}</span>
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
        disableFilters: true,
        accessor: "status_names",
        Cell: tableInstance => {
          let status = [];
          let gro_status = tableInstance.row.original.child;
          gro_status.forEach(element => {
            status.push(element.name);
          });
          return <span>{status.join(", ")}</span>;
        }
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
        accessor: "id",
        disableSortBy: true,
        disableFilters: true,
        Cell: tableInstance => {
          let grp = tableInstance.row.original;
          let new_grp_array = {
            id: grp.id,
            name: grp.name,
            status: grp.child
          };
          return (
            <div className="react-action-class">
              {tableInstance.row.original.default_group !== 1 ? (
                <>
                  <button
                    className="table-action action-edit"
                    onClick={() => {
                      setEditData(new_grp_array);
                      setIsEdit(true);
                      setOpenModal(true);
                    }}
                    disabled={
                      user.parent === 0 ||
                      check_permission(
                        `group_${tableInstance.value}`,
                        "edit_permission",
                        user.permissions
                      )
                        ? false
                        : true
                    }
                  >
                    <Edit3 className="table-icon-edit" />
                  </button>

                  <button
                    className="table-action action-delete"
                    onClick={() => {
                      toggleDeleteModalOpen(true);
                      setDeleteID(tableInstance.row.original.id);
                    }}
                    disabled={
                      user.parent === 0 ||
                      check_permission(
                        `group_${tableInstance.value}`,
                        "edit_permission",
                        user.permissions
                      )
                        ? false
                        : true
                    }
                  >
                    <Trash className="table-icon-edit" />
                  </button>
                </>
              ) : (
                "-"
              )}
            </div>
          );
        }
      }
    ],
    // eslint-disable-next-line
    [getGroupsData]
  );
  const {
    getTableProps,
    getTableBodyProps,
    prepareRow,
    page,
    headerGroups,
    pageCount,
    gotoPage,
    state: { pageIndex }
  } = useTable(
    {
      data: groupsList,
      columns: columns,
      initialState: {
        pageSize: 10,
        pageIndex: 0
      }
    },
    useFilters,
    useSortBy,
    usePagination
  );

  const deleteClick = () => {
    fetching();
    deleteGroup(token, deleteId).then(res => {
      if (res.success) {
        toggleRefresh(true);
        toggleDeleteModalOpen(false);
        getGroupStatusData(token);
        success(res.message);
      } else {
        error(res.message);
      }
    });
  };

  return (
    <div className="container-fluid">
      <div className="row title-sec align-items-center">
        <div className="col-sm headline">Groups</div>
        <div className="col-sm-auto ml-auto">
          <button
            className="btn btn-blue"
            onClick={() => setOpenModal(true)}
            disabled={user.parent === 0 || permission ? false : true}
          >
            <Plus className="mr-2" /> Add Group
          </button>
        </div>
      </div>
      <div className="div-container">
        <ReactTableWrapper {...props}>
          {/* <h4 class="box-title">User Subscription History</h4> */}
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
                ) : page?.length > 0 ? (
                  page.map(row => {
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
            <div className="col-sm-6 text-center text-sm-left"></div>
            <div className="col-sm-6">
              <Pagination
                onPageChange={gotoPage}
                pages={pageCount}
                page={pageIndex}
              />
            </div>
          </div>
        </ReactTableWrapper>
      </div>
      <Modal centered isOpen={isOpen} backdrop={true}>
        {isOpen && (
          <GroupsAddModal
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
      <Modal centered isOpen={openDeleteModal} backdrop={true}>
        {openDeleteModal && (
          <ConformationModalUser
            isOpen={openDeleteModal}
            onClose={() => toggleDeleteModalOpen(false)}
            confirmText={"Delete"}
            message={
              "All the status in this group and their enquiries will also be deleted if you delete this group."
            }
            handleConfirm={() => deleteClick()}
          />
        )}
      </Modal>
    </div>
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
  connect(mapStateToProps, {
    success,
    error,
    fetching,
    setuser,
    getGroupStatusData
  })
)(Groups);

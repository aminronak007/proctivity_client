import React, { useCallback, useEffect, useMemo, useState } from "react";
import NavigationActions from "redux/navigation/actions";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import AuthActions from "redux/auth/actions";
import { Modal, UncontrolledTooltip } from "reactstrap";
import StatusAddModal from "./StatusAddModal";
import ReactTableWrapper from "components/reacttable/reacttbl.style";
import classNames from "classnames";
import { useTable, useSortBy, useFilters, usePagination } from "react-table";
import Pagination from "components/common/Pagination";
import { deleteStatus, getStatus } from "services/statusServices";
import ConformationModal from "components/common/ConformationModal";
import { Edit3, Plus, Trash } from "react-feather";
import { check_permission } from "../../../helper/methods";
import TableLoader from "components/common/TableLoaders";
// import { changePassword } from "services/userServices";
const { success, error, fetching } = NavigationActions;
const { setuser } = AuthActions;
const Status = props => {
  const { token, success, error, fetching, user, isFetching } = props;

  const [isOpen, setOpenModal] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const [refresh, toggleRefresh] = useState(true);
  const [statusList, setStatusList] = useState([]);
  const [openDeleteModal, toggleDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteID] = useState("");
  let permission = check_permission(
    "group_status",
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
  const getStatusList = useCallback(async () => {
    fetching();
    await getStatus(token).then(data => {
      if (data.success) {
        setStatusList(data.data);
        success();
        toggleRefresh(false);
      } else {
        error(data.message);
      }
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    refresh && getStatusList();
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
              title="Status Name"
            />
          );
        },
        // Filter: FilterComponent,
        placeholder: "Status Name",
        disableFilters: true,
        accessor: "name",
        Cell: tableInstance => (
          <span className="text-capitalize">{tableInstance.value}</span>
        )
      },
      // {
      //     Header: (tableInstance) => {
      //         return (
      //             <HeaderComponent
      //                 isSortedDesc={tableInstance.column.isSortedDesc}
      //                 title="Status"
      //             />
      //         );
      //     },
      //     // Filter: FilterComponent,
      //     placeholder: "Status",
      //     disableFilters: true,
      //     accessor: "status",
      //     Cell: (tableInstance) => (
      //         <span className="text-capitalize">
      //             {tableInstance.row.values.status}
      //         </span>
      //     ),
      // },
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
          return (
            <div className="react-action-class">
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
              <span id={`delete_btn${tableInstance.row.original.id}`}>
                <button
                  className="table-action action-delete"
                  onClick={() => {
                    toggleDeleteModalOpen(true);
                    setDeleteID(tableInstance.row.original.id);
                  }}
                  disabled={
                    (user.parent === 0 || permission ? false : true) ||
                    tableInstance.row.original.group_status_id !== null
                  }
                >
                  <Trash className="table-icon-edit" />
                </button>
              </span>
              {tableInstance.row.original.group_status_id !== null ? (
                <UncontrolledTooltip
                  placement="right"
                  target={`delete_btn${tableInstance.row.original.id}`}
                >
                  Group status in used.
                </UncontrolledTooltip>
              ) : (
                <></>
              )}
            </div>
          );
        }
      }
    ],
    // eslint-disable-next-line
    [getStatusList]
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
      data: statusList,
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
    deleteStatus(token, { id: deleteId }).then(res => {
      if (res.success) {
        toggleRefresh(true);
        success(res.message);
      } else {
        error(res.message);
      }
      toggleDeleteModalOpen(false);
    });
  };
  return (
    <div className="container-fluid">
      <div className="row title-sec align-items-center">
        <div className="col-sm headline">Status</div>
        <div className="col-sm-auto ml-auto">
          <button
            className="btn btn-blue"
            onClick={() => setOpenModal(true)}
            disabled={user.parent === 0 || permission ? false : true}
          >
            <Plus className="mr-2" /> Add Status
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
                {/* {headerGroups.map((headerGroup) => (
                                  <tr {...headerGroup.getHeaderGroupProps()}>
                                      {headerGroup.headers.map((header) => {
                                          return (
                                              <td
                                                  {...header.getHeaderProps(
                                                      header.getSortByToggleProps()
                                                  )}
                                              >
                                                  <div>
                                                      {header.canFilter
                                                          ? header.render(
                                                                "Filter"
                                                            )
                                                          : null}
                                                  </div>
                                              </td>
                                          );
                                      })}
                                  </tr>
                              ))} */}

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
          <Pagination
            onPageChange={gotoPage}
            pages={pageCount}
            page={pageIndex}
          />
        </ReactTableWrapper>
      </div>
      <Modal centered isOpen={isOpen} backdrop={true}>
        {isOpen && (
          <StatusAddModal
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
      {openDeleteModal && (
        <ConformationModal
          isOpen={openDeleteModal}
          onClose={() => toggleDeleteModalOpen(false)}
          confirmText={"Delete"}
          message={"Are you sure to delete status ?"}
          handleConfirm={() => deleteClick()}
        />
      )}
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
  connect(mapStateToProps, { success, error, fetching, setuser })
)(Status);

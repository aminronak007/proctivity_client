import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import Pagination from "components/common/Pagination";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import ReactTableWrapper from "components/reacttable/reacttbl.style";
import classnames from "classnames";
import { getMarketingDataList } from "services/marketingDataListServices";
import NavigationActions from "redux/navigation/actions";
import { compose } from "redux";
import { Modal } from "reactstrap";
import EditMarketingDataEntry from "./EditMarketingDataEntry";
import { Edit3 } from "react-feather";
import TableLoader from "components/common/TableLoaders";
import Select from "react-select";
import ConformationModalUser from "components/common/ConformationModalUser";

const { success, error, fetching } = NavigationActions;

let debounceTimer;

const HeaderComponent = props => {
  let classes = {
    "-sort-asc": props.isSortedDesc !== undefined && !props.isSortedDesc,
    "-sort-desc": props.isSortedDesc !== undefined && props.isSortedDesc
  };
  return <div className={classnames(classes)}>{props.title}</div>;
};

const MarketingDataList = props => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageLength, setPageLength] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [sortObject, setSortObject] = useState({ id: "id", desc: false });
  const { token, success, error, fetching, isFetching } = props;

  const [isOpen, setOpenModal] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const [refresh, toggleRefresh] = useState(false);
  const [marketingDataList, setMarketingDataList] = useState([]);
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

  // eslint-disable-next-line
  const [addLoader, setAddLoader] = useState(false);

  const closeConfrimModal = () =>
    setConfirmProps({
      isOpen: false,
      confirmText: "",
      confirmMessage: ""
    });

  // const deleteClick = id => {
  //   setAddLoader(true);
  //   deleteMarketingDataList(token, id).then(res => {
  //     if (res.success) {
  //       success(res.message);
  //       setAddLoader(false);
  //       closeConfrimModal();
  //       toggleRefresh(true);
  //     } else {
  //       error(res.message);
  //     }
  //   });
  // };

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
              title="Name"
            />
          );
        },
        placeholder: "Name",
        disableFilters: true,
        accessor: "first_name",
        Cell: tableInstance => (
          <span className="text-capitalize">
            {`${tableInstance.row.values.first_name} ${tableInstance.row.original.last_name}`}
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
              title="Customer Type"
            />
          );
        },
        placeholder: "Customer Type",
        disableFilters: true,
        accessor: "CustomerType",
        Cell: tableInstance => {
          return tableInstance.row.original.CustomerType ? (
            <span>{tableInstance.row.original.CustomerType}</span>
          ) : (
            "-"
          );
        }
      },
      {
        Header: tableInstance => {
          return (
            <HeaderComponent
              isSortedDesc={tableInstance.column.isSortedDesc}
              title="Service Type"
            />
          );
        },
        placeholder: "Service Type",
        disableFilters: true,
        accessor: "ServiceType",
        Cell: tableInstance => {
          return tableInstance.row.original.ServiceType ? (
            <span>{tableInstance.row.original.ServiceType}</span>
          ) : (
            "-"
          );
        }
      },
      {
        Header: tableInstance => {
          return (
            <HeaderComponent
              isSortedDesc={tableInstance.column.isSortedDesc}
              title="Repeat Customer ?"
            />
          );
        },
        placeholder: "Repeat Customer ?",
        disableFilters: true,
        accessor: "RepeatCustomer",
        Cell: tableInstance => {
          return tableInstance.row.original.RepeatCustomer ? (
            <span>{tableInstance.row.original.RepeatCustomer}</span>
          ) : (
            "-"
          );
        }
      },
      {
        Header: tableInstance => {
          return (
            <HeaderComponent
              isSortedDesc={tableInstance.column.isSortedDesc}
              title="Where did you find us ?"
            />
          );
        },
        placeholder: "Where did you find us ?",
        disableFilters: true,
        accessor: "FindUs",
        Cell: tableInstance => {
          return tableInstance.row.original.FindUs ? (
            <span>{tableInstance.row.original.FindUs}</span>
          ) : (
            "-"
          );
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
        accessor: "updated_at",
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
                // disabled={
                //     user.parent === 0 || permission
                //         ? false
                //         : true
                // }
              >
                <Edit3 className="table-icon-edit" />
              </button>

              {/* <button
                                className="table-action action-delete"
                                onClick={() => {
                                    setConfirmProps({
                                        isOpen: true,
                                        confirmText: "Delete",
                                        confirmMessage:
                                            "Are you sure you want to delete the user ?",
                                        confirmFunc: () =>
                                            deleteClick(
                                                tableInstance.row.original.id
                                            ),
                                    });
                                    // setDeleteID();
                                }}
                                // disabled={
                                //     user.parent === 0 || permission
                                //         ? false
                                //         : true
                                // }
                            >
                                <Trash className="table-icon-edit" />
                            </button> */}
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
      data: marketingDataList,
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
      sort_on: sortObject.id ? sortObject.id : "id",
      sort: sortObject.desc ? "desc" : "asc"
      // sortBy: sortObject,
    };

    await getMarketingDataList(token, params).then(data => {
      fetching();
      if (data.success) {
        setMarketingDataList(data.data.marketingData);
        setTotalRecords(data.data.totalRecords);
        setTotalPage(Math.ceil(data.data.totalRecords / pageLength));
        toggleRefresh(false);
        success();
      } else {
        error(data.message);
      }
    });
    // eslint-disable-next-line
  }, [currentPage, pageLength, sortObject, refresh]);

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
  }, [currentPage, sortObject, callApi]);

  useEffect(() => {
    // Call api here
    setCurrentPage(0);
  }, [sortObject, pageLength]);

  useEffect(() => {
    setSortObject({ ...sortBy[0] });
  }, [sortBy]);

  const handlePageChange = page => {
    fetching();
    setCurrentPage(page);
  };
  // let permission = check_permission(
  //     "users",
  //     "edit_permission",
  //     user.permissions
  // );

  return (
    <>
      <div className="container-fluid">
        <div className="row title-sec align-items-center">
          <div className="col-sm headline">Marketing Data List</div>
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
              <div className="col-md-auto ml-auto mt-3 mt-md-0"></div>
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
                                    placeholder="Search..."
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
                  {marketingDataList.length < pageLength
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
                <EditMarketingDataEntry
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
            handleConfirm={confirmProps.confirmSendFunc}
            addLoader={addLoader}
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
  connect(mapStateToProps, { success, error, fetching })
)(MarketingDataList);

import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import Pagination from "components/common/Pagination";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import ReactTableWrapper from "components/reacttable/reacttbl.style";
import classnames from "classnames";
import { useParams } from "react-router-dom";
import {
  deleteQuoteById,
  FinalizeQuote,
  getQuotesByCustomerId
} from "services/customer/quotes/customerQuotesService";
import NavigationActions from "redux/navigation/actions";
import { compose } from "redux";
import AuthActions from "redux/auth/actions";
import { Modal } from "reactstrap";
import QuotesAddModal from "./QuotesAddModal";
import ConformationModalUser from "components/common/ConformationModalUser";
import { saveAs } from "file-saver";
import { Trash, Edit3, Plus, CheckCircle, Download } from "react-feather";
import { ViewCustomer } from "services/customer/customerService";
import { check_permission, GetTheTime } from "helper/methods";
import TableLoader from "components/common/TableLoaders";
import Select from "react-select";
import Warning from "assets/images/alert-circle.svg";
import BackButton from "components/common/BackButton";

// import { changePassword } from "services/userServices";

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

const CustomerQuotes = props => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageLength, setPageLength] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [sortObject, setSortObject] = useState({ id: "id", desc: true });
  const { token, success, error, fetching, user, isFetching } = props;
  const [customer_detail, SetCustomerDetail] = useState();
  const { id, group_id, status_id } = useParams();

  const [isOpen, setOpenModal] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState("");
  const [refresh, toggleRefresh] = useState(false);
  const [quotesList, setQuotesList] = useState([]);
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

  const deleteClick = id => {
    setAddLoader(true);
    deleteQuoteById(token, id).then(res => {
      if (res.success) {
        success(res.message);
        setAddLoader(false);
        closeConfrimModal();
        toggleRefresh(true);
      } else {
        error(res.message);
        setAddLoader(false);
      }
    });
  };

  const finalizeQuote = (id, q_id) => {
    setAddLoader(true);
    FinalizeQuote(token, id, { quote_id: q_id }).then(data => {
      if (data.success) {
        success(data.message);
        setAddLoader(false);
        closeConfrimModal();
        toggleRefresh(true);
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
              title="Quote ID"
            />
          );
        },
        placeholder: "Quote ID",
        disableFilters: true,
        accessor: "quote_number",
        Cell: tableInstance => (tableInstance.value ? tableInstance.value : "-")
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
        accessor: "name"
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
              title="Date"
            />
          );
        },
        placeholder: "Date",
        disableFilters: true,
        accessor: "created_at",
        Cell: tableInstance => GetTheTime(tableInstance.value)
      },
      {
        Header: tableInstance => {
          return (
            <HeaderComponent
              isSortedDesc={tableInstance.column.isSortedDesc}
              title="Amount"
            />
          );
        },
        placeholder: "Amount",
        disableSortBy: true,
        disableFilters: true,
        accessor: "total_price",
        Cell: tableInstance => `$${tableInstance.value}`
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
        accessor: "quote_status"
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
              {tableInstance.row.original.quote_status === "draft" ? (
                <button
                  className="table-action action-success"
                  onClick={() => {
                    setConfirmProps({
                      isOpen: true,
                      confirmText: "Finalize",
                      confirmMessage:
                        "Are you sure you want to finalize the quote ?",
                      customIcon: Warning,
                      confirmFunc: () =>
                        finalizeQuote(
                          tableInstance.row.original.id,
                          tableInstance.row.original.quote_id
                        )
                    });
                  }}
                  disabled={
                    (user.parent === 0 || permission) &&
                    tableInstance.row.original.quote_status === "draft"
                      ? false
                      : true
                  }
                >
                  <CheckCircle className="table-icon-edit" />
                </button>
              ) : (
                <></>
              )}
              <button
                className="table-action action-edit"
                onClick={() => {
                  setEditData(tableInstance.row.original.id);
                  setIsEdit(true);
                  setOpenModal(true);
                }}
                disabled={
                  (user.parent === 0 || permission) &&
                  tableInstance.row.original.quote_status === "draft"
                    ? false
                    : true
                }
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
                      "Are you sure you want to delete the quote ?",
                    confirmFunc: () =>
                      deleteClick(tableInstance.row.original.id)
                  });
                  // setDeleteID();
                }}
                disabled={
                  (user.parent === 0 || permission) &&
                  tableInstance.row.original.quote_status === "draft"
                    ? false
                    : true
                }
              >
                <Trash className="table-icon-edit" />
              </button>
              {tableInstance.row.original.quote_status !== "draft" &&
              tableInstance.row.original.quote_status !== "canceled" ? (
                <button
                  className="table-action action-download"
                  disabled={user.parent === 0 || permission ? false : true}
                  onClick={() => {
                    saveAs(
                      `${process.env.REACT_APP_BACKEND_URI_UPLOAD}/quotes/${tableInstance.row.original.quote_id}.pdf`,
                      tableInstance.row.original.quote_id
                    );
                  }}
                >
                  <Download />
                </button>
              ) : (
                <></>
              )}
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
      data: quotesList,
      columns: columns,
      manualSortBy: true,
      initialState: {
        pageSize: pageLength,
        pageIndex: 0,
        sortBy: [
          {
            id: "id",
            desc: true
          }
        ]
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

    await getQuotesByCustomerId(token, id, params).then(data => {
      fetching();
      if (data.success) {
        setQuotesList(data.data.quotes);
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
    `group_${group_id}_status_${status_id}`,
    "edit_permission",
    user.permissions
  );

  const GetCustomerInfo = id => {
    ViewCustomer(token, id).then(data => {
      if (data.success) {
        SetCustomerDetail(data.data);
      } else {
        error(data.message);
      }
    });
  };

  useEffect(() => {
    if (id !== undefined) {
      GetCustomerInfo(id);
    }
    // eslint-disable-next-line
  }, [id]);

  return (
    <>
      <div className="container-fluid">
        <div className="row title-sec align-items-center">
          <div className="col-sm headline">Quotes</div>
          <div className="col-sm-auto ml-auto">
            <BackButton history={props.history} />
          </div>
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

                  <div className="col-sm-auto pl-sm-0">
                    <button
                      className="btn btn-blue"
                      onClick={() => setOpenModal(true)}
                      disabled={user.parent === 0 || permission ? false : true}
                    >
                      <Plus className="mr-2" /> Add Quote
                    </button>
                  </div>
                </div>
              </div>
            </div>

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
                  {quotesList.length < pageLength
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

            <Modal size="lg" centered isOpen={isOpen} backdrop={true}>
              {isOpen && (
                <QuotesAddModal
                  onClose={() => {
                    setOpenModal(false);
                    setIsEdit(false);
                    setEditData("");
                  }}
                  isEdit={isEdit}
                  editId={editData}
                  toggleRefresh={e => toggleRefresh(e)}
                  customer_detail={customer_detail}
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
            handleConfirm={confirmProps.confirmFunc}
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
)(CustomerQuotes);

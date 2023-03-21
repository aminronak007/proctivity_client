import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import Pagination from "components/common/Pagination";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import ReactTableWrapper from "components/reacttable/reacttbl.style";
import classnames from "classnames";
import { useParams } from "react-router-dom";
import {
  getInvoicesByCustomerId,
  downloadInvoiceByCustomerId
} from "services/customer/invoices/customerInvoiceService";
import NavigationActions from "redux/navigation/actions";
import { compose } from "redux";
import AuthActions from "redux/auth/actions";
import { Modal } from "reactstrap";
import ConformationModalUser from "components/common/ConformationModalUser";
import { Download } from "react-feather";
import { check_permission, GetTheTime } from "helper/methods";
import TableLoader from "components/common/TableLoaders";
import Select from "react-select";
import BackButton from "components/common/BackButton";
import Loader1 from "assets/images/Loaders/loader-1.svg";

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

const CustomerInvoices = props => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageLength, setPageLength] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [sortObject, setSortObject] = useState({ id: "id", desc: false });
  const { token, success, error, fetching, user, isFetching } = props;
  const { id, group_id, status_id } = useParams();
  const [refresh, toggleRefresh] = useState(false);
  const [invoicesList, setInvoicesList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [totalRecords, setTotalRecords] = useState("0");
  const [row_id, setRowId] = useState(null);
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
              title="Invoice ID"
            />
          );
        },
        placeholder: "Invoice ID",
        disableFilters: true,
        accessor: "invoice_number",
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
              title="Status"
            />
          );
        },
        placeholder: "Status",
        disableSortBy: true,
        disableFilters: true,
        accessor: "invoince_status"
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
        accessor: "stripe_invoice_id",
        disableSortBy: true,
        disableFilters: true,
        Cell: tableInstance => {
          return (
            <div className="react-action-class">
              {addLoader && tableInstance.row.original.id === row_id ? (
                <img src={Loader1} width={30} alt="loader" />
              ) : (
                <button
                  className="table-action action-download"
                  disabled={user.parent === 0 || permission ? false : true}
                  onClick={() => {
                    const a = document.createElement("a");
                    downloadInvoice(tableInstance.value, a);
                    setRowId(tableInstance.row.original.id);
                  }}
                >
                  <Download />
                </button>
              )}
            </div>
          );
        }
      }
    ],
    // eslint-disable-next-line
    [currentPage, addLoader]
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
      data: invoicesList,
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

    await getInvoicesByCustomerId(token, id, params).then(data => {
      fetching();
      if (data.success) {
        console.log(data.data.invoices);
        setInvoicesList(data.data.invoices);
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

  const downloadInvoice = async (id, element) => {
    setAddLoader(true);
    await downloadInvoiceByCustomerId(token, {
      invoice_id: id
    }).then(data => {
      element.download = "myImage.gif";
      element.href = data.data.url;
      element.click();
      setAddLoader(false);
      // saveAs(data.data.url, "Invoice");
    });
  };

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

  return (
    <>
      <div className="container-fluid">
        <div className="row title-sec align-items-center">
          <div className="col-sm headline">Invoices</div>
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
                </div>
              </div>
            </div>

            <div className="table-responsive common-table">
              <table className="table border-0" {...getTableProps()}>
                <thead className="thead-dark">
                  {headerGroups?.map(headerGroup => (
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
                  {invoicesList.length < pageLength
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
)(CustomerInvoices);

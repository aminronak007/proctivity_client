import React, { useCallback, useEffect, useMemo, useState } from "react";
import NavigationActions from "redux/navigation/actions";
import { useParams, withRouter } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import AuthActions from "redux/auth/actions";
import { Modal } from "reactstrap";
import AddDocumentsModal from "./AddDocumentsModal";
import ReactTableWrapper from "components/reacttable/reacttbl.style";
import classNames from "classnames";
import { useTable, useSortBy, useFilters, usePagination } from "react-table";
import Pagination from "components/common/Pagination";
import {
  getDocsByCustomerId,
  deleteDocById
} from "services/customer/documents/customerDocsService";
import ConformationModalUser from "components/common/ConformationModalUser";
import { Plus, Trash, Download } from "react-feather";
import TableLoader from "components/common/TableLoaders";
import moment from "moment";
import { saveAs } from "file-saver";
import PDFICON from "assets/images/Icons/pdf-icon.svg";
import DOCICON from "assets/images/Icons/doc-icon.svg";
import DOCXICON from "assets/images/Icons/docx-icon.svg";
import CSVICON from "assets/images/Icons/csv-icon.svg";
import { check_permission } from "../../../../helper/methods";
import BackButton from "components/common/BackButton";

const { success, error, fetching } = NavigationActions;
const { setuser } = AuthActions;

const CustomerDocs = props => {
  const { token, success, error, fetching, user, isFetching } = props;
  const { group_id, status_id, id } = useParams();
  const [isOpen, setOpenModal] = useState();
  const [refresh, toggleRefresh] = useState(true);
  const [docsList, setDocsList] = useState([]);
  const [openDeleteModal, toggleDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteID] = useState("");

  const HeaderComponent = props => {
    let classes = {
      "-sort-asc": props.isSortedDesc !== undefined && !props.isSortedDesc,
      "-sort-desc": props.isSortedDesc !== undefined && props.isSortedDesc
    };
    return <div className={classNames(classes)}>{props.title}</div>;
  };

  const getDocsData = useCallback(async () => {
    fetching();
    await getDocsByCustomerId(token, id).then(data => {
      if (data.success) {
        setDocsList(data.data);
        toggleRefresh(false);
        success();
      } else {
        error();
      }
    });

    // eslint-disable-next-line
  }, []);

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
              title="Document/Image"
            />
          );
        },
        placeholder: "document/image",
        disableFilters: true,
        accessor: "filename",
        Cell: tableInstance => {
          let fileExt = tableInstance.value
            .split(".")
            .pop()
            .toLowerCase();
          let showFile = (fileIcon, fileName) => {
            return (
              <div className="row">
                <div className="col-12">
                  <img
                    className="customer_image"
                    src={fileIcon}
                    alt="pdf-icon"
                  />
                </div>
                <div className="col-12 mt-2">
                  <span>{fileName}</span>
                </div>
              </div>
            );
          };
          if (fileExt === "pdf") {
            return showFile(PDFICON, tableInstance.row.original.original_name);
          } else if (fileExt === "doc") {
            return showFile(DOCICON, tableInstance.row.original.original_name);
          } else if (fileExt === "docx") {
            return showFile(DOCXICON, tableInstance.row.original.original_name);
          } else if (fileExt === "csv") {
            return showFile(CSVICON, tableInstance.row.original.original_name);
          } else {
            let src = `${process.env.REACT_APP_BACKEND_URI_UPLOAD}/${tableInstance.value}`;
            return showFile(src, tableInstance.row.original.original_name);
          }
        }
      },
      {
        Header: tableInstance => {
          return (
            <HeaderComponent
              isSortedDesc={tableInstance.column.isSortedDesc}
              title="Name of User"
            />
          );
        },
        placeholder: "Name of User",
        disableFilters: true,
        accessor: "username",
        Cell: tableInstance => (
          <span className="text-capitalize">{tableInstance.value}</span>
        )
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
        Cell: tableInstance => (
          <span className="text-capitalize">
            {moment(tableInstance.value).format("DD MMM YYYY, h:mm A")}
          </span>
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
        accessor: "id",
        disableSortBy: true,
        disableFilters: true,
        Cell: tableInstance => {
          return (
            <div className="react-action-class">
              <button
                className="table-action action-download"
                // disabled={
                //     user.parent === 0 || permission
                //         ? false
                //         : true
                // }
                onClick={() => {
                  saveAs(
                    `${process.env.REACT_APP_BACKEND_URI_UPLOAD}/${tableInstance.row.original.filename}`,
                    tableInstance.row.original.original_name
                  );
                }}
              >
                <Download />
              </button>
              <button
                className="table-action action-delete"
                onClick={() => {
                  toggleDeleteModalOpen(true);
                  setDeleteID(tableInstance.row.original.id);
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
    [getDocsData]
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
      data: docsList,
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
    deleteDocById(token, deleteId).then(res => {
      if (res.success) {
        toggleRefresh(true);
        toggleDeleteModalOpen(false);
        success(res.message);
      } else {
        error(res.message);
      }
    });
  };

  let permission = check_permission(
    `group_${group_id}_status_${status_id}`,
    "edit_permission",
    user.permissions
  );

  useEffect(() => {
    if (refresh) {
      getDocsData();
    }
    // eslint-disable-next-line
  }, [refresh]);

  return (
    <div className="container-fluid">
      <div className="row title-sec align-items-center">
        <div className="col-sm headline">Documents</div>
        <div className="col-sm-auto ml-auto">
          <BackButton history={props.history} />
        </div>
      </div>
      <div className="div-container">
        <div className="row title-sec align-items-center">
          <div className="col-sm-auto ml-auto">
            <button
              className="btn btn-blue"
              onClick={() => setOpenModal(true)}
              disabled={user.parent === 0 || permission ? false : true}
            >
              <Plus className="mr-2" /> Upload
            </button>
          </div>
        </div>
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
          <Pagination
            onPageChange={gotoPage}
            pages={pageCount}
            page={pageIndex}
          />
        </ReactTableWrapper>
      </div>
      <Modal centered isOpen={isOpen} backdrop={true}>
        {isOpen && (
          <AddDocumentsModal
            onClose={() => {
              setOpenModal(false);
            }}
            toggleRefresh={e => toggleRefresh(e)}
            user={user}
          />
        )}
      </Modal>
      <Modal centered isOpen={openDeleteModal} backdrop={true}>
        {openDeleteModal && (
          <ConformationModalUser
            isOpen={openDeleteModal}
            onClose={() => toggleDeleteModalOpen(false)}
            message={"Are you sure you want to delete the file ?"}
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
  connect(mapStateToProps, { success, error, fetching, setuser })
)(CustomerDocs);

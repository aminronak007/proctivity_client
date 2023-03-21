import React, { useCallback, useEffect, useMemo, useState } from "react";
import NavigationActions from "redux/navigation/actions";
import { useParams, withRouter } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import AuthActions from "redux/auth/actions";
import { Modal } from "reactstrap";
import NotesAddModal from "./NotesAddModal";
import ReactTableWrapper from "components/reacttable/reacttbl.style";
import classNames from "classnames";
import { useTable, useSortBy, useFilters, usePagination } from "react-table";
import Pagination from "components/common/Pagination";
import {
  getNotesByCustomerId,
  deleteNoteById
} from "services/customer/notes/customerNotesService";
import ConformationModalUser from "components/common/ConformationModalUser";
import { Edit3, Plus, Trash } from "react-feather";
import TableLoader from "components/common/TableLoaders";
import moment from "moment";
import { check_permission } from "../../../../helper/methods";
import BackButton from "components/common/BackButton";

const { success, error, fetching } = NavigationActions;
const { setuser } = AuthActions;

const CustomerNotes = props => {
  const { token, success, error, fetching, user, isFetching } = props;
  const { group_id, status_id, id } = useParams();
  const [isOpen, setOpenModal] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const [refresh, toggleRefresh] = useState(true);
  const [notesList, setNotesList] = useState([]);
  const [openDeleteModal, toggleDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteID] = useState("");

  const HeaderComponent = props => {
    let classes = {
      "-sort-asc": props.isSortedDesc !== undefined && !props.isSortedDesc,
      "-sort-desc": props.isSortedDesc !== undefined && props.isSortedDesc
    };
    return <div className={classNames(classes)}>{props.title}</div>;
  };

  const getNotesData = useCallback(async () => {
    fetching();
    await getNotesByCustomerId(token, id).then(data => {
      if (data.success) {
        setNotesList(data.data);
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
      getNotesData();
    }
    // eslint-disable-next-line
  }, [refresh]);

  let permission = check_permission(
    `group_${group_id}_status_${status_id}`,
    "edit_permission",
    user.permissions
  );

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
              title="Notes"
            />
          );
        },
        placeholder: "Notes",
        disableFilters: true,
        accessor: "notes",
        Cell: tableInstance => (
          <span className="text-capitalize">{tableInstance.value}</span>
        )
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
                  toggleDeleteModalOpen(true);
                  console.log(tableInstance.row.original.id);
                  setDeleteID(tableInstance.row.original.id);
                }}
                disabled={
                  (user.parent === 0 || permission) &&
                  tableInstance.row.original.main_note !== 1
                    ? false
                    : true
                }
              >
                <Trash className="table-icon-edit" />
              </button>
            </div>
          );
        }
      }
    ],
    // eslint-disable-next-line
    [getNotesData]
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
      data: notesList,
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
    deleteNoteById(token, deleteId).then(res => {
      if (res.success) {
        toggleRefresh(true);
        toggleDeleteModalOpen(false);
        success(res.message);
      } else {
        error(res.message);
      }
    });
  };

  return (
    <div className="container-fluid">
      <div className="row title-sec align-items-center">
        <div className="col-sm headline">Notes</div>
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
              <Plus className="mr-2" /> Add Note
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
          <NotesAddModal
            onClose={() => {
              setOpenModal(false);
              setIsEdit(false);
              setEditData({});
            }}
            isEdit={isEdit}
            editData={editData}
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
            confirmText={"Delete"}
            message={"Are you sure you want to delete the note ?"}
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
)(CustomerNotes);

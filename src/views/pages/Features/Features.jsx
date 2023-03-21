import React, { useCallback, useEffect, useMemo, useState } from "react";
import NavigationActions from "redux/navigation/actions";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import AuthActions from "redux/auth/actions";
import { Modal } from "reactstrap";
import FeaturesAddModal from "./FeaturesAddModal";
import ReactTableWrapper from "components/reacttable/reacttbl.style";
import classNames from "classnames";
import { useTable, useSortBy, useFilters, usePagination } from "react-table";
import Pagination from "components/common/Pagination";
import { deleteFeature, getFeatures } from "services/featuresServices";
import ConformationModal from "components/common/ConformationModal";
import { Edit3, Plus, Trash } from "react-feather";
// import { changePassword } from "services/userServices";
const { success, error, fetching } = NavigationActions;
const { setuser } = AuthActions;
const Features = props => {
  const { token, success, error, fetching } = props;
  const [isOpen, setOpenModal] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const [refresh, toggleRefresh] = useState(true);
  const [featuresList, setFeatursList] = useState([]);
  const [openDeleteModal, toggleDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteID] = useState("");
  const HeaderComponent = props => {
    let classes = {
      "-sort-asc": props.isSortedDesc !== undefined && !props.isSortedDesc,
      "-sort-desc": props.isSortedDesc !== undefined && props.isSortedDesc
    };
    return <div className={classNames(classes)}>{props.title}</div>;
  };
  const getFeaturesList = useCallback(async () => {
    fetching();
    await getFeatures(token).then(data => {
      if (data.success) {
        setFeatursList(data.data);
        // success();
        toggleRefresh(false);
      } else {
        error(data.message);
      }
    });

    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    refresh && getFeaturesList();
    // eslint-disable-next-line
  }, [refresh]);
  const columns = useMemo(
    () => [
      {
        Header: tableInstance => {
          return (
            <HeaderComponent
              isSortedDesc={tableInstance.column.isSortedDesc}
              title="Feature Name"
            />
          );
        },
        // Filter: FilterComponent,
        placeholder: "Feature Name",
        disableFilters: true,
        accessor: "name",
        Cell: tableInstance => (
          <span className="text-capitalize">
            {tableInstance.row.values.name}
          </span>
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
        // Filter: FilterComponent,
        placeholder: "Status",
        disableFilters: true,
        accessor: "status",
        Cell: tableInstance => (
          <span className="text-capitalize">
            {tableInstance.row.values.status}
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
              >
                <Edit3 className="table-icon-edit" />
              </button>
              <button
                className="table-action action-delete"
                onClick={() => {
                  toggleDeleteModalOpen(true);
                  setDeleteID(tableInstance.row.original.id);
                }}
              >
                <Trash className="table-icon-edit" />
              </button>
            </div>
          );
        }
      }
    ],
    // eslint-disable-next-line
    [getFeaturesList]
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
      data: featuresList,
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
    deleteFeature(token, { id: deleteId }).then(res => {
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
        <div className="col-sm headline">Features</div>
        <div className="col-sm-auto ml-auto">
          <button className="btn btn-blue" onClick={() => setOpenModal(true)}>
            <Plus className="mr-2" /> Add Feature
          </button>
        </div>
      </div>
      <div className="div-container">
        <ReactTableWrapper {...props}>
          <h4 class="box-title">User Subscription History</h4>
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
                {page.map(row => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map(cell => (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      ))}
                    </tr>
                  );
                })}
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
      <Modal isOpen={isOpen} backdrop={true}>
        {isOpen && (
          <FeaturesAddModal
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
          message={"Are you sure to delete feature ?"}
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
    user: state.auth.user
  };
};
export default compose(
  withRouter,
  connect(mapStateToProps, { success, error, fetching, setuser })
)(Features);

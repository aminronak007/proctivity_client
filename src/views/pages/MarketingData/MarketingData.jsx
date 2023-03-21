import React, { useEffect, useState } from "react";
import NavigationActions from "redux/navigation/actions";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import AuthActions from "redux/auth/actions";
import { Modal } from "reactstrap";
import MarketingDataAddModal from "./MarketingDataAddModal";
import Warning from "assets/images/alert-circle.svg";

// import ReactTableWrapper from "components/reacttable/reacttbl.style";
// import Pagination from "components/common/Pagination";
import {
  deleteMarketingData,
  getMarketingData,
  updateMarketingData
} from "services/marketingDataServices";
import ConformationModalUser from "components/common/ConformationModalUser";
import { Trash, Edit3, Plus } from "react-feather";
import { check_permission } from "../../../helper/methods";
import TableLoader from "components/common/TableLoaders";
// import moment from "moment";

// import { changePassword } from "services/userServices";

const { success, error, fetching } = NavigationActions;
const { setuser } = AuthActions;

const MarketingData = props => {
  const { token, success, error, fetching, user, isFetching } = props;

  const [addLoader, setAddLoader] = useState(false);
  const [isOpen, setOpenModal] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const [refresh, toggleRefresh] = useState(true);
  const [marketingDataList, setMarketingDataList] = useState([]);
  const [openDeleteModal, toggleDeleteModalOpen] = useState(false);
  const [type, setType] = useState("");
  const [id, setId] = useState("");
  const [confirmProps, setConfirmProps] = useState({
    confirmText: "",
    confirmMessage: ""
  });

  const tablesType = [
    "Customer",
    "Service",
    "Repeat Customer",
    "Where did you find us"
  ];

  const column = [
    {
      column: "Sr No.",
      index: "no"
    },
    {
      column: "Value",
      index: "value"
    },
    {
      column: "Activate/Deactivate",
      index: "status"
    },
    {
      column: "Action",
      index: "id"
    }
  ];

  const getMarketingDataList = async () => {
    fetching();
    await getMarketingData(token, "list").then(data => {
      if (data.success) {
        setMarketingDataList(data.data);
        success();
        toggleRefresh(false);
      } else {
        error(data.message);
      }
    });
  };

  const updateStatus = data => {
    setAddLoader(true);
    updateMarketingData(token, data).then(data => {
      if (data.success) {
        success(data.message);
        setAddLoader(false);
        toggleRefresh(true);
        toggleDeleteModalOpen(false);
      } else {
        error(data.message);
      }
    });
  };

  useEffect(() => {
    refresh && getMarketingDataList();

    // eslint-disable-next-line
  }, [refresh]);

  const deleteClick = id => {
    setAddLoader(true);
    deleteMarketingData(token, { id: id }).then(res => {
      if (res.success) {
        success(res.message);
        setAddLoader(false);
        toggleRefresh(true);
        toggleDeleteModalOpen(false);
      } else {
        error(res.message);
      }
    });
  };

  let permission = check_permission(
    "marketing_data",
    "edit_permission",
    user.permissions
  );

  return (
    <div className="container-fluid marketing-data-page">
      <div className="row title-sec align-items-center">
        <div className="col-sm headline">Manage Marketing Data</div>
      </div>
      {tablesType.map((x, i) => {
        let data =
          marketingDataList && marketingDataList.length > 0
            ? marketingDataList.filter(fi => fi.type === x)
            : [];
        return (
          <div
            className={`div-container height-auto ${i > 0 ? "mt-4" : ""}`}
            key={`key_${i}`}
          >
            <div className="row title-sec align-items-center">
              <div className="col-sm headline">
                {x}{" "}
                {x === "Repeat Customer" || x === "Where did you find us"
                  ? ""
                  : "Type"}
              </div>

              <div className="col-sm-auto ml-auto">
                <button
                  className="btn btn-blue"
                  onClick={() => {
                    setOpenModal(true);
                    setType(x);
                    setId("");
                  }}
                  disabled={user.parent === 0 || permission ? false : true}
                >
                  <Plus className="mr-2" /> Add New
                </button>
              </div>
            </div>
            <div className="table-responsive">
              <table className={"table"}>
                {/* {caption && <caption>{caption ? caption : ""}</caption>} */}
                <thead className={"thead-dark"}>
                  <tr>
                    {column &&
                      column.map((e, i) => {
                        return <th key={i}>{e.column}</th>;
                      })}
                  </tr>
                </thead>
                <tbody>
                  {data && data.length > 0 ? (
                    data.map((e, i) => {
                      return isFetching && e.id === id ? (
                        <TableLoader colspan={column?.length} />
                      ) : e?.type === x && e?.value ? (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{e.value}</td>
                          <td>
                            {/* <div className="form-group"> */}
                            <div className="pretty p-switch p-fill">
                              <input
                                type="checkbox"
                                checked={e.status === "active"}
                                value={
                                  e.status === "active" ? "active" : "inactive"
                                }
                                onChange={event =>
                                  setConfirmProps({
                                    confirmText: "Change",
                                    confirmMessage:
                                      "This will activate/deactivate the status.",
                                    handleConfirm: () =>
                                      updateStatus({
                                        ...e,
                                        status:
                                          e.status === "inactive"
                                            ? "active"
                                            : "inactive"
                                      }),
                                    customIcon: Warning
                                  })
                                }
                                onClick={() => {
                                  toggleDeleteModalOpen(true);
                                  setId(e.id);
                                  // setDeleteID();
                                }}
                                disabled={
                                  user.parent === 0 || permission ? false : true
                                }
                              />
                              <div className="state">
                                <label></label>
                              </div>
                            </div>
                            {/* </div> */}
                          </td>
                          <td>
                            <div className="react-action-class">
                              <button
                                className="table-action action-edit"
                                onClick={() => {
                                  setEditData(e);
                                  setIsEdit(true);
                                  setOpenModal(true);
                                  setType(x);
                                  setId(e.id);
                                }}
                                disabled={
                                  user.parent === 0 || permission ? false : true
                                }
                              >
                                <Edit3 className="table-icon-edit" />
                              </button>
                              <button
                                className="table-action action-delete"
                                onClick={() => {
                                  setType(x);
                                  setConfirmProps({
                                    confirmText: "Delete",
                                    confirmMessage:
                                      "Are you sure you want to delete this field?",
                                    handleConfirm: () => deleteClick(e.id)
                                  });
                                  toggleDeleteModalOpen(true);
                                  setId(e.id);
                                  // setDeleteID();
                                }}
                                disabled={user.parent === 0 ? false : true}
                              >
                                <Trash className="table-icon-edit" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        <tr>
                          <td className="text-center " colSpan={column?.length}>
                            No Data Found
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td className="text-center" colSpan={column?.length}>
                        No Data Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      <Modal centered isOpen={isOpen} backdrop={true}>
        {isOpen && (
          <MarketingDataAddModal
            onClose={() => {
              setOpenModal(false);
              setIsEdit(false);
              setEditData({});
              setType("");
            }}
            isEdit={isEdit}
            type={type}
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
            confirmText={confirmProps.confirmText}
            message={confirmProps.confirmMessage}
            handleConfirm={confirmProps.handleConfirm}
            addLoader={addLoader}
            customIcon={confirmProps.customIcon}
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
)(MarketingData);

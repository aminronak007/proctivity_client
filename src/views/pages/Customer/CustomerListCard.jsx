import React, { useState, useEffect } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import NavigationActions from "redux/navigation/actions";
import { compose } from "redux";
import AuthActions from "redux/auth/actions";
import {
  getStatusFromGroup,
  deleteCustomer,
  assignStatus,
  assignUser
} from "services/customer/customerService";
import { Modal } from "reactstrap";
import { Trash, Edit3, ChevronRight } from "react-feather";

import { Link } from "react-router-dom";
import { check_permission } from "../../../helper/methods";

import Select from "react-select";
import {
  ChevronLeft,
  Calendar,
  File,
  FileText,
  CreditCard
} from "react-feather";
import CustomerEditModel from "./CustomerEditModel";
import ConformationModalUser from "components/common/ConformationModalUser";
// import { changePassword } from "services/userServices";

const { success, error, fetching } = NavigationActions;
const { setuser } = AuthActions;

const CustomerListCard = props => {
  const {
    token,
    user,
    row,
    groupOptions,
    toggleRefresh,
    groups_status,
    userOptions,
    setCurrentPage
  } = props;

  const [silderOpen, setSliderOpen] = useState(false);
  const [statusOptions, setStatusOptions] = useState([]);
  const [rowValues, SetrowValues] = useState(row);
  const [isOpen, setOpenModal] = useState();
  const [editData, setEditData] = useState({});
  const [addLoader, setAddLoader] = useState(false);
  const closeConfrimModal = () =>
    setConfirmProps({
      isOpen: false,
      confirmText: "",
      confirmMessage: ""
    });
  const [confirmProps, setConfirmProps] = useState({
    isOpen: false,
    confirmText: "",
    confirmMessage: ""
  });
  useEffect(() => {
    getStatusData(); // getUserRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowValues.group_id]);

  useEffect(() => {
    SetrowValues(row);
  }, [row]);

  const updateCustomerGroupStatus = data => {
    assignStatus(token, data).then(res => {
      if (res.success) {
        success(res.message);
        // GetCustomers(groups_status.group_id, groups_status.status_id);
        toggleRefresh(true);
        setCurrentPage(0);
        SetrowValues({ ...row });
      } else {
        error(res.message);
      }
    });
  };

  const assignUserToEntry = data => {
    assignUser(token, data).then(res => {
      if (res.success) {
        success(res.message);
        toggleRefresh(true);
      } else {
        error(res.message);
      }
    });
  };
  const getStatusData = async () => {
    await getStatusFromGroup(token, {
      group_id: rowValues.group_id
    }).then(data => {
      if (data.success) {
        setStatusOptions(data.data.map(x => ({ value: x.id, label: x.name })));
      }
    });
  };

  let permission = check_permission(
    `group_${groups_status.group_id}_status_${groups_status.status_id}`,
    "edit_permission",
    user.permissions
  );
  const deleteClick = id => {
    setAddLoader(true);
    deleteCustomer(token, id).then(res => {
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

  return (
    <>
      <div
        className={
          silderOpen
            ? `customer-entry-main customer-entry-showall-icons row`
            : `customer-entry-main row`
        }
      >
        <div className="col customer-detail-card order-1">
          <div className="customer-entry-box customer-detail-card-inner">
            <ul className="list-inline mb-0">
              <li className="list-inline-item">
                <label>Ref NO.</label>
                {row.reference_number}
              </li>
              <li className="list-inline-item">
                <label>Name</label>
                {row.first_name} {row.last_name}
              </li>
              <li className="list-inline-item">
                <label>Email</label>
                {row.email}
              </li>
              <li className="list-inline-item">
                <label>Mobile</label>
                {row.phone}
              </li>
              <li className="list-inline-item">
                <label>Address</label>
                {row.address}
              </li>
              <li className="list-inline-item">
                <label>Group</label>
                <Select
                  id="group_id"
                  classNamePrefix="GroupStatusDropdown"
                  value={groupOptions.find(x => x.value === rowValues.group_id)}
                  placeholder="Select Group"
                  onChange={e => {
                    // row.group_id = e.value;
                    SetrowValues(
                      Object.assign({}, rowValues, {
                        group_id: e.value
                      })
                    );
                    // row.group_id = e.value;
                  }}
                  options={groupOptions}
                />
              </li>
              <li className="list-inline-item">
                <label>Status</label>
                <Select
                  id="status_id"
                  classNamePrefix="GroupStatusDropdown"
                  value={statusOptions.find(
                    x => x.value === rowValues.status_id
                  )}
                  placeholder="Select Status"
                  onChange={e => {
                    SetrowValues(
                      Object.assign({}, rowValues, {
                        status_id: e.value
                      })
                    );
                    updateCustomerGroupStatus({
                      group_id: rowValues.group_id,
                      status_id: e.value,
                      id: row.id
                    });
                  }}
                  options={statusOptions}
                />
              </li>
              <li className="list-inline-item">
                <label>Assign User</label>
                <Select
                  id="assign_user_id"
                  classNamePrefix="GroupStatusDropdown"
                  value={userOptions.find(
                    x => x.value === rowValues.assign_user_id
                  )}
                  placeholder="Select User"
                  onChange={e => {
                    SetrowValues(
                      Object.assign({}, rowValues, {
                        assign_user_id: e.value
                      })
                    );
                    assignUserToEntry({
                      id: row.id,
                      assign_user_id: e.value
                    });
                  }}
                  options={userOptions}
                  isDisabled={rowValues.eventID === null ? false : true}
                />
              </li>
            </ul>
            <button
              onClick={() => setSliderOpen(false)}
              className="btn less-detail"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
        <div className="col-md-auto four-icon-card order-3 order-md-2 pl-3 px-md-0">
          <div className="customer-entry-box four-icon">
            {}
            <Link
              to={`/customer/${row.id}/calendar`}
              disabled={user.parent === 0 || permission ? false : true}
            >
              <Calendar />
            </Link>
            <Link
              className="mr-0"
              to={`/customer-entries/${row.group_id}/${row.status_id}/${row.id}/notes`}
              disabled={user.parent === 0 || permission ? false : true}
            >
              <File />
            </Link>
            <Link
              className="mb-0"
              to={`/customer-entries/${row.group_id}/${row.status_id}/${row.id}/docs`}
              disabled={user.parent === 0 || permission ? false : true}
            >
              <FileText />
            </Link>
            <button
              className="btn m-0"
              onClick={() => {
                setEditData(row);
                setOpenModal(true);
              }}
              disabled={user.parent === 0 || permission ? false : true}
            >
              <Edit3 />
            </button>
          </div>
        </div>
        <div className="col-md more-icons-card order-3 order-md-2 pl-3 px-md-0">
          <ul className="list-inline more-icons mb-0">
            <li className="list-inline-item customer-entry-box">
              <Link
                to={`/customer/${row.id}/calendar`}
                className="btn"
                disabled={user.parent === 0 || permission ? false : true}
              >
                <Calendar />
                <span className="d-block">Schedule</span>
              </Link>
            </li>
            <li className="list-inline-item customer-entry-box">
              <Link
                to={`/customer-entries/${row.group_id}/${row.status_id}/${row.id}/notes`}
                className="btn"
                disabled={user.parent === 0 || permission ? false : true}
              >
                <File />
                <span className="d-block">Notes</span>
              </Link>
            </li>
            <li className="list-inline-item customer-entry-box">
              <Link
                to={`/customer-entries/${row.group_id}/${row.status_id}/${row.id}/docs`}
                className="btn"
                disabled={user.parent === 0 || permission ? false : true}
              >
                <FileText />
                <span className="d-block">Documents</span>
              </Link>
            </li>
            <li className="list-inline-item customer-entry-box">
              <button
                className="btn"
                disabled={user.parent === 0 || permission ? false : true}
                onClick={() => {
                  setEditData(row);
                  setOpenModal(true);
                }}
              >
                <Edit3 />
                <span className="d-block">Edit Info</span>
              </button>
            </li>
            <li className="list-inline-item customer-entry-box">
              <button className="btn">
                <Link
                  to={`/customer-entries/${row.group_id}/${row.status_id}/${row.id}/quotes`}
                  className="btn"
                  disabled={user.parent === 0 || permission ? false : true}
                >
                  <FileText />
                  <span className="d-block">Quotes</span>
                </Link>
              </button>
            </li>
            <li className="list-inline-item customer-entry-box">
              <button className="btn">
                <Link
                  to={`/customer-entries/${row.group_id}/${row.status_id}/${row.id}/invoices`}
                  className="btn"
                  disabled={user.parent === 0 || permission ? false : true}
                >
                  <FileText />
                  <span className="d-block">Invoices</span>
                </Link>
              </button>
            </li>
            <li className="list-inline-item customer-entry-box">
              <button className="btn">
                <CreditCard />
                <span className="d-block">Take Payment</span>
              </button>
            </li>
          </ul>
        </div>
        <div className="col-auto more-detail-arrow order-2 order-md-3">
          <button
            className="btn customer-entry-box more-detail"
            onClick={() => setSliderOpen(true)}
          >
            <ChevronLeft />
          </button>
          <button
            className="btn customer-entry-box delete-detail"
            onClick={() => {
              setConfirmProps({
                isOpen: true,
                confirmText: "Delete",
                confirmMessage:
                  "Are you sure you want to delete the customer ?",
                handleConfirm: () => deleteClick(row.id)
              });
              // setDeleteID();
            }}
            disabled={user.parent === 0 || permission ? false : true}
          >
            <Trash />
          </button>
        </div>
      </div>
      <Modal centered isOpen={isOpen} backdrop={true}>
        {isOpen && (
          <CustomerEditModel
            onClose={() => {
              setOpenModal(false);
              setEditData({});
            }}
            editData={editData}
            toggleRefresh={e => toggleRefresh(e)}
          />
        )}
      </Modal>
      <Modal centered isOpen={confirmProps.isOpen} backdrop={true}>
        {confirmProps.isOpen && (
          <ConformationModalUser
            isOpen={confirmProps.isOpen}
            onClose={() => closeConfrimModal()}
            confirmText={confirmProps.confirmText}
            message={confirmProps.confirmMessage}
            handleConfirm={confirmProps.handleConfirm}
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
  connect(mapStateToProps, { success, error, fetching, setuser })
)(CustomerListCard);

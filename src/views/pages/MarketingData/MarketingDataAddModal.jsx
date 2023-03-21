import React, { useEffect, useState } from "react";
import enhancer from "./enhancer/MarketingDataEnhancer";
import NavigationActions from "redux/navigation/actions";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import AuthActions from "redux/auth/actions";
import { ModalHeader, ModalBody, Button } from "reactstrap";
import {
  addMarketingData,
  updateMarketingData
} from "services/marketingDataServices";
import { check_permission } from "../../../helper/methods";
// import { changePassword } from "services/userServices";

const { success, error, fetching } = NavigationActions;
const { setuser } = AuthActions;

const MarketingDataAddModal = props => {
  const {
    token,
    success,
    error,
    isEdit,
    onClose,
    values,
    handleChange,
    handleSubmit,
    setValues,
    isValid,
    handleBlur,
    errors,
    touched,
    submitCount,
    toggleRefresh,
    editData,
    type,
    user
  } = props;

  const [addLoader, setAddLoader] = useState(false);
  const Error = props => {
    const field1 = props.field;
    if ((errors[field1] && touched[field1]) || submitCount > 0) {
      return (
        <span className={props.class ? props.class : "error-msg"}>
          {errors[field1]}
        </span>
      );
    } else {
      return <span />;
    }
  };

  const handleRoleSubmit = async e => {
    e.preventDefault();
    handleSubmit();
    var addData = { ...values, type: type, status: "active" };
    if (isValid) {
      setAddLoader(true);
      isEdit
        ? updateMarketingData(token, addData).then(data => {
            if (data.success) {
              success(data.message);
              onClose();
              toggleRefresh(true);
              setAddLoader(false);
            } else {
              error(data.message);
              setAddLoader(false);
            }
          })
        : addMarketingData(token, addData).then(data => {
            if (data.success) {
              success(data.message);
              toggleRefresh(true);
              onClose();
              setAddLoader(false);
            } else {
              error(data.message);
              setAddLoader(false);
            }
          });
    }
  };

  useEffect(() => {
    isEdit &&
      setValues({
        ...editData
      });
    // eslint-disable-next-line
  }, [editData]);
  let permission = check_permission(
    "marketing_data",
    "edit_permission",
    user.permissions
  );

  return (
    <>
      <ModalHeader toggle={() => onClose()}>
        {`${isEdit ? "Update" : "Add"} ${type} type`}
      </ModalHeader>
      <ModalBody>
        <div className="form-group">
          <label>
            Value <span className="error-msg">*</span>
          </label>
          <input
            type="text"
            className="form-control react-form-input"
            placeholder="Value"
            id="value"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.value}
          />
          <Error field="value" />
        </div>

        {/* <div className="form-group">
                        <label>
                            Role Status <span className="error-msg">*</span>
                        </label>
                        <Select
                            id="status"
                            value={values.status}
                            placeholder="Select status"
                            onChange={(e) => {
                                setFieldValue("status", e);
                            }}
                            options={statusOptions}
                        />
                        <Error field="status" />
                    </div> */}

        <Button
          className="btn btn-blue w-100 border-0"
          type="button"
          onClick={e => handleRoleSubmit(e)}
          disabled={
            addLoader || (user.parent === 0 || permission ? false : true)
          }
        >
          {isEdit ? "Update" : "Add"}
        </Button>
      </ModalBody>
    </>
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
  enhancer,
  connect(mapStateToProps, { success, error, fetching, setuser })
)(MarketingDataAddModal);

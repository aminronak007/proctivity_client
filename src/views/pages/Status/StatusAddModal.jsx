import React, { useEffect, useState } from "react";
import enhancer from "./enhancer/StatusEnhancer";
import NavigationActions from "redux/navigation/actions";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import AuthActions from "redux/auth/actions";
import { ModalHeader, ModalBody, Button } from "reactstrap";
import { addStatus, updateStatus } from "services/statusServices";
// import { changePassword } from "services/userServices";

const { success, error, fetching } = NavigationActions;
const { setuser } = AuthActions;

const StatusAddModal = props => {
  const {
    isFetching,
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
    fetching
  } = props;
  const [addLoader, setAddLoader] = useState(false);

  const Error = props => {
    const field1 = props.field;
    if ((errors[field1] && touched[field1]) || submitCount > 0) {
      return (
        <span className={props.class ? props.class : "error-msg"}>
          {field1 === "status" ? errors[field1]?.value : errors[field1]}
        </span>
      );
    } else {
      return <span />;
    }
  };

  const handleStatusSubmit = async e => {
    e.preventDefault();
    handleSubmit();
    var statusData = { ...values };
    if (isValid) {
      setAddLoader(true);
      isEdit
        ? updateStatus(token, statusData).then(data => {
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
        : addStatus(token, statusData).then(data => {
            if (data.success) {
              success(data.message);
              toggleRefresh(true);
              setAddLoader(false);
              onClose();
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

  return (
    <>
      <ModalHeader toggle={() => onClose()}>
        {`${isEdit ? "Update" : "Add"} Status`}
      </ModalHeader>
      <ModalBody>
        <div className="form-group">
          <label>
            Status Name <span className="error-msg">*</span>
          </label>
          <input
            type="text"
            className="form-control react-form-input"
            placeholder="Status Name"
            id="name"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.name}
          />
          <Error field="name" />
        </div>

        <Button
          className="btn btn-blue w-100 border-0"
          onClick={e => handleStatusSubmit(e)}
          type="button"
          disabled={addLoader}
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
    user: state.auth.user,
    isFetching: state.navigation.isFetching
  };
};

export default compose(
  withRouter,
  enhancer,
  connect(mapStateToProps, { success, error, fetching, setuser })
)(StatusAddModal);

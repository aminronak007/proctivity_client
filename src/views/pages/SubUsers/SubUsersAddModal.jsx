import React, { useEffect, useState } from "react";
import enhancer from "./enhancer/SubUsersEnhancer";
import NavigationActions from "redux/navigation/actions";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import AuthActions from "redux/auth/actions";
import { ModalHeader, ModalBody, Button } from "reactstrap";
import { addSubUser, updateSubUser } from "services/subUsersServices";
import ModalLoader from "components/common/ModalLoader";
import { processRequestMsg } from "helper/constant";

const { success, error, fetching } = NavigationActions;
const { setuser } = AuthActions;

const UsersAddModal = props => {
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

  const handleUserSubmit = async e => {
    e.preventDefault();
    handleSubmit();
    var usersData = { ...values };
    if (isValid) {
      setAddLoader(true);
      isEdit
        ? await updateSubUser(token, usersData.id, usersData).then(data => {
            if (data.success) {
              success(data.message);
              setAddLoader(false);
              onClose();
              toggleRefresh(true);
            } else {
              error(data.message);
              setAddLoader(false);
            }
          })
        : await addSubUser(token, user.id, usersData).then(data => {
            if (data.success) {
              success(data.message);
              setAddLoader(false);
              toggleRefresh(true);
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
        {`${isEdit ? "Update" : "Add"} User`}
      </ModalHeader>
      <ModalBody>
        {addLoader ? (
          <ModalLoader message={processRequestMsg} />
        ) : (
          <>
            <div className="form-group">
              <label>
                Name <span className="error-msg">*</span>
              </label>
              <input
                type="text"
                className="form-control react-form-input"
                placeholder="Name"
                id="username"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.username}
              />
              <Error field="username" />
            </div>
            <div className="form-group">
              <label>
                Email <span className="error-msg">*</span>
              </label>
              <input
                type="email"
                className="form-control react-form-input"
                placeholder="Email"
                id="email"
                disabled={isEdit ? true : false}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
              />
              <Error field="email" />
            </div>
            <div className="form-group">
              <label>
                Mobile <span className="error-msg">*</span>
              </label>
              <input
                type="text"
                className="form-control react-form-input"
                placeholder="Mobile"
                id="phone"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.phone}
              />
              <Error field="phone" />
            </div>
            <div className="form-group">
              <label>
                Role <span className="error-msg">*</span>
              </label>
              <input
                type="text"
                className="form-control react-form-input"
                placeholder="Role"
                id="role"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.role}
              />
              <Error field="role" />
            </div>
          </>
        )}
        <Button
          className="btn btn-blue w-100 border-0"
          type="button"
          onClick={e => handleUserSubmit(e)}
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
    user: state.auth.user
  };
};

export default compose(
  withRouter,
  enhancer,
  connect(mapStateToProps, { success, error, fetching, setuser })
)(UsersAddModal);

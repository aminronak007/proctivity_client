import React, { useEffect } from "react";
import enhancer from "./enhancer/FeaturesEnhancer";
import NavigationActions from "redux/navigation/actions";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import AuthActions from "redux/auth/actions";
import { ModalHeader, ModalBody, Button } from "reactstrap";
import Select from "react-select";
import { addFeature, updateFeature } from "services/featuresServices";
// import { changePassword } from "services/userServices";

const { success, error, fetching } = NavigationActions;
const { setuser } = AuthActions;

const FeaturesAddModal = props => {
  const {
    token,
    success,
    error,
    isEdit,
    onClose,
    values,
    handleChange,
    handleSubmit,
    setFieldValue,
    setValues,
    isValid,
    handleBlur,
    errors,
    touched,
    submitCount,
    toggleRefresh,
    editData
  } = props;

  const statusOptions = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" }
  ];
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

  const handleFeaturSubmit = async e => {
    e.preventDefault();
    handleSubmit();
    var featureData = { ...values, status: values.status.value };
    if (isValid) {
      fetching();
      isEdit
        ? updateFeature(token, featureData).then(data => {
            if (data.success) {
              success(data.message);
              onClose();
              toggleRefresh(true);
            } else {
              error(data.message);
            }
          })
        : addFeature(token, featureData).then(data => {
            if (data.success) {
              success(data.message);
              toggleRefresh(true);
              onClose();
            } else {
              error(data.message);
            }
          });
    }
  };

  useEffect(() => {
    isEdit &&
      setValues({
        ...editData,
        status: statusOptions.find(x => x.value === editData.status)
      });
    // eslint-disable-next-line
  }, [editData]);

  return (
    <>
      <ModalHeader toggle={() => onClose()}>
        {`${isEdit ? "Update" : "Add"} Feature`}
      </ModalHeader>
      <ModalBody>
        <div className="form-group">
          <label>
            Feature Name <span className="error-msg">*</span>
          </label>
          <input
            type="text"
            className="form-control react-form-input"
            placeholder="Feature Name"
            id="name"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.name}
          />
          <Error field="name" />
        </div>

        <div className="form-group">
          <label>
            Feature Status <span className="error-msg">*</span>
          </label>
          <Select
            id="status"
            value={values.status}
            placeholder="Select status"
            onChange={e => {
              setFieldValue("status", e);
            }}
            options={statusOptions}
          />
          <Error field="status" />
        </div>

        <Button
          className="btn c-primary btn-block"
          onClick={e => handleFeaturSubmit(e)}
          type="button"
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
)(FeaturesAddModal);

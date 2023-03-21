import React, { useEffect, useState } from "react";
import enhancer from "./enhancer/SubUsersEnhancer";
import NavigationActions from "redux/navigation/actions";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import AuthActions from "redux/auth/actions";
import { ModalHeader, ModalBody, Button } from "reactstrap";
import { updateMarketingDataList } from "services/marketingDataListServices";
import ModalLoader from "components/common/ModalLoader";
import Select from "react-select";
import { getMarketingData } from "services/marketingDataServices";
import { processRequestMsg } from "helper/constant";

const { success, error, fetching } = NavigationActions;
const { setuser } = AuthActions;

const EditMarketingDataEntry = props => {
  const {
    token,
    success,
    error,
    isEdit,
    onClose,
    values,
    setFieldValue,
    handleSubmit,
    setValues,
    isValid,
    errors,
    touched,
    submitCount,
    toggleRefresh,
    editData
  } = props;

  const [addLoader, setAddLoader] = useState(false);
  const [customerTypeOptions, setCustomerTypeOptions] = useState([]);
  const [serviceTypeOpt, setServiceTypeOpt] = useState([]);
  const [repeatCustomreOpt, setRepeatCustomerOpt] = useState([]);
  const [findUsOpt, setFindUsOpt] = useState([]);
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
    var marketingData = { ...values };
    if (isValid) {
      setAddLoader(true);
      await updateMarketingDataList(token, marketingData).then(data => {
        if (data.success) {
          success(data.message);
          setAddLoader(false);
          onClose();
          toggleRefresh(true);
        } else {
          error(data.message);
          setAddLoader(false);
        }
      });
    }
  };

  const getMarketingDataOpt = async () => {
    await getMarketingData(token, "active").then(data => {
      if (data.success) {
        setCustomerTypeOptions(
          data.data
            .filter(f => f.type === "Customer")
            .map(x => ({ value: x.id, label: x.value }))
        );
        setServiceTypeOpt(
          data.data
            .filter(f => f.type === "Service")
            .map(x => ({ value: x.id, label: x.value }))
        );
        setRepeatCustomerOpt(
          data.data
            .filter(f => f.type === "Repeat Customer")
            .map(x => ({ value: x.id, label: x.value }))
        );
        setFindUsOpt(
          data.data
            .filter(f => f.type === "Where did you find us")
            .map(x => ({ value: x.id, label: x.value }))
        );
      } else {
        error(data.message);
      }
    });
  };

  useEffect(() => {
    isEdit &&
      setValues({
        ...editData
      });

    // eslint-disable-next-line
  }, [editData]);

  useEffect(() => {
    getMarketingDataOpt();
    // eslint-disable-next-line
  }, []);

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
                disabled
                id="username"
                value={`${values.first_name} ${values.last_name}`}
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
                disabled
                value={values.email}
              />
              <Error field="email" />
            </div>
            <div className="form-group">
              <label>Customer Type</label>
              <Select
                id="customer_type_id"
                value={customerTypeOptions.find(
                  x => x.value === values.customer_type_id
                )}
                placeholder="Please Select"
                onChange={e => {
                  setFieldValue("customer_type_id", e === null ? "" : e.value);
                }}
                options={customerTypeOptions}
              />
              <Error field="customer_type_id" />
            </div>
            <div className="form-group">
              <label>Service Type</label>
              <Select
                id="service_type_id"
                value={serviceTypeOpt.find(
                  x => x.value === values.service_type_id
                )}
                placeholder="Please Select"
                onChange={e => {
                  setFieldValue("service_type_id", e === null ? "" : e.value);
                }}
                options={serviceTypeOpt}
              />
              <Error field="service_type_id" />
            </div>
            <div className="form-group">
              <label>Repeat Customer ?</label>
              <Select
                id="repeat_customer_id"
                value={repeatCustomreOpt.find(
                  x => x.value === values.repeat_customer_id
                )}
                placeholder="Please Select"
                onChange={e => {
                  setFieldValue(
                    "repeat_customer_id",
                    e === null ? "" : e.value
                  );
                }}
                options={repeatCustomreOpt}
              />
              <Error field="repeat_customer_id" />
            </div>
            <div className="form-group">
              <label>Where did you find us ?</label>
              <Select
                id="customer_find_us_id"
                value={findUsOpt.find(
                  x => x.value === values.customer_find_us_id
                )}
                placeholder="Please Select"
                onChange={e => {
                  setFieldValue(
                    "customer_find_us_id",
                    e === null ? "" : e.value
                  );
                }}
                options={findUsOpt}
              />
              <Error field="customer_find_us_id" />
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
)(EditMarketingDataEntry);

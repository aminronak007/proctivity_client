import React, { useEffect, useState } from "react";
import enhancer from "./enhancer/CustomerEditModelEnhancer";
import NavigationActions from "redux/navigation/actions";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import AuthActions from "redux/auth/actions";
import { ModalHeader, ModalBody, Button } from "reactstrap";
import {
  updateCustomer,
  getStatusFromGroup
} from "services/customer/customerService";
import { getGroups } from "services/groupsServices";
import Select from "react-select";
import ModalLoader from "components/common/ModalLoader";
import { Row, Col, Input } from "reactstrap";
import { processRequestMsg } from "helper/constant";
import { usePlacesWidget } from "react-google-autocomplete";

const { success, error, fetching } = NavigationActions;
const { setuser } = AuthActions;

const UsersAddModal = props => {
  const {
    token,
    success,
    error,
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
    setFieldValue
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
  const [statusOptions, setStatusOptions] = useState([]);
  const [groupOptions, setGroupOptions] = useState([]);

  const { ref } = usePlacesWidget({
    apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    onPlaceSelected: place => {
      FormatePlaces(place);
    },
    options: {
      // types: ["(regions)"],
      componentRestrictions: { country: "au" },
      fields: ["address_components", "geometry"],
      types: ["address"]
    }
  });

  const FormatePlaces = place => {
    let postcode = "";
    let address1 = "";
    let city = "";
    let state = "";
    for (const component of place.address_components) {
      console.log(component);
      // @ts-ignore remove once typings fixed
      const componentType = component.types[0];

      switch (componentType) {
        case "street_number": {
          address1 += component.long_name;
          break;
        }
        case "route": {
          address1 += component.long_name;
          break;
        }
        case "postal_code": {
          postcode = `${component.long_name}${postcode}`;
          break;
        }

        case "postal_code_suffix": {
          postcode = `${postcode}-${component.long_name}`;
          break;
        }

        case "locality":
          city = component.long_name;
          break;
        case "administrative_area_level_1": {
          state = component.short_name;
          break;
        }
        default: {
        }
      }
    }
    setFieldValue("address", address1);
    setFieldValue("address2", city);
    setFieldValue("postal_code", postcode);
    setFieldValue("city", city);
    setFieldValue("state", state);
    setFieldValue("country", process.env.REACT_APP_COUNTRY);
  };

  const getGroupsData = async () => {
    await getGroups(token).then(data => {
      if (data.success) {
        setGroupOptions(data.data.map(x => ({ value: x.id, label: x.name })));
      } else {
        error(data.message);
      }
    });
  };
  useEffect(() => {
    getStatusData(); // getUserRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.group_id]);
  const getStatusData = async () => {
    await getStatusFromGroup(token, {
      group_id: values.group_id
    }).then(data => {
      if (data.success) {
        setStatusOptions(data.data.map(x => ({ value: x.id, label: x.name })));
      }
    });
  };
  const handleUserSubmit = async e => {
    e.preventDefault();
    handleSubmit();
    var usersData = { ...values };
    if (isValid) {
      setAddLoader(true);
      await updateCustomer(token, usersData.id, usersData).then(data => {
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

  useEffect(() => {
    setValues({
      ...editData,
      address2: editData.city
    });
    getGroupsData();
    // eslint-disable-next-line
  }, [editData]);

  return (
    <>
      <ModalHeader toggle={() => onClose()}>Edit</ModalHeader>
      <ModalBody>
        {addLoader ? (
          <ModalLoader message={processRequestMsg} />
        ) : (
          <>
            <Row>
              <Col sm={12} md={6} lg={6}>
                <div className="form-group">
                  <label>
                    First Name <span className="error-msg">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control react-form-input"
                    id="first_name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.first_name}
                    placeholder="First Name"
                  />
                  <Error field="first_name" />
                </div>
              </Col>
              <Col sm={12} md={6} lg={6}>
                <div className="form-group">
                  <label>
                    Last Name <span className="error-msg">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control react-form-input"
                    id="last_name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.last_name}
                    placeholder="Last Name"
                  />
                  <Error field="last_name" />
                </div>
              </Col>
              <Col sm={12} md={6} lg={6}>
                <div className="form-group">
                  <label>
                    Email <span className="error-msg">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control react-form-input"
                    id="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                    placeholder="Email"
                  />
                  <Error field="email" />
                </div>
              </Col>
              <Col sm={12} md={6} lg={6}>
                <div className="form-group">
                  <label>
                    Phone Number <span className="error-msg">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control react-form-input"
                    id="phone"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.phone}
                    placeholder="Phone Number"
                  />
                  <Error field="phone" />
                </div>
              </Col>
              <Col sm={12} md={6} lg={12}>
                <div className="form-group">
                  <label>
                    Address <span className="error-msg">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control react-form-input"
                    id="address"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.address}
                    placeholder="Address"
                    ref={ref}
                  />
                  <Error field="address" />
                </div>
              </Col>
              <Col sm={12} md={6} lg={6}>
                <div className="form-group">
                  <label>
                    Address Line 2 <span className="error-msg">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control react-form-input"
                    id="address2"
                    readOnly
                    value={values.address2}
                    placeholder="Address Line 2"
                  />
                  <Error field="address2" />
                </div>
              </Col>
              <Col sm={12} md={6} lg={6}>
                <div className="form-group">
                  <label>
                    Zip/Postcode <span className="error-msg">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control react-form-input"
                    id="postal_code"
                    readOnly
                    value={values.postal_code}
                    placeholder="Zip/Postcode"
                  />
                  <Error field="postal_code" />
                </div>
              </Col>
              <Col sm={12} md={6} lg={6}>
                <div className="form-group">
                  <label>
                    State <span className="error-msg">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control react-form-input"
                    id="state"
                    readOnly
                    value={values.state}
                    placeholder="State"
                  />
                  <Error field="state" />
                </div>
              </Col>
              <Col sm={12} md={6} lg={6}>
                <div className="form-group">
                  <label>
                    Country <span className="error-msg">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control react-form-input"
                    id="country"
                    readOnly
                    value={values.country}
                    placeholder="Country"
                  />
                  <Error field="country" />
                </div>
              </Col>
              <Col sm={12}>
                <div className="form-group">
                  <label>Notes</label>
                  <Input
                    type="textarea"
                    className="form-control react-form-input"
                    id="notes"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.notes}
                    placeholder="Notes"
                  />
                </div>
              </Col>
              <Col sm={12} md={6} lg={6}>
                <div className="form-group">
                  <label>Group</label>
                  <Select
                    id="group_id"
                    value={groupOptions.find(x => x.value === values.group_id)}
                    placeholder="Select Group"
                    onChange={e => {
                      setFieldValue(
                        "group_id",
                        e === null ? undefined : e.value
                      );
                    }}
                    options={groupOptions}
                  />
                  <Error field="group_id" />
                </div>
              </Col>
              <Col sm={12} md={6} lg={6}>
                <div className="form-group">
                  <label>Status</label>
                  <Select
                    id="status_id"
                    value={statusOptions.find(
                      x => x.value === values.status_id
                    )}
                    placeholder="Select Status"
                    onChange={e => {
                      setFieldValue(
                        "status_id",
                        e === null ? undefined : e.value
                      );
                    }}
                    options={statusOptions}
                  />
                  <Error field="group_id" />
                </div>
              </Col>
            </Row>
          </>
        )}
        <Button
          className="btn btn-blue w-100 border-0"
          type="button"
          onClick={e => handleUserSubmit(e)}
          disabled={addLoader}
        >
          Update
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

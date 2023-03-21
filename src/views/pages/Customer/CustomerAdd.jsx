import React, { useEffect, useState } from "react";
import enhancer from "./enhancer/CustomerAddEnhancer";
import NavigationActions from "redux/navigation/actions";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import AuthActions from "redux/auth/actions";
import { Row, Col, Input } from "reactstrap";
import {
  addCustomer,
  getStatusFromGroup
} from "services/customer/customerService";
import Select from "react-select";
import { getGroups } from "services/groupsServices";
import { getMarketingData } from "services/marketingDataServices";
import { check_file_size } from "helper/methods";
import CardLoader from "components/common/CardLoader";
import { usePlacesWidget } from "react-google-autocomplete";

const { success, error, fetching } = NavigationActions;
const { setuser } = AuthActions;

const CustomerAdd = props => {
  const {
    token,
    success,
    error,
    values,
    handleChange,
    handleSubmit,
    isValid,
    handleBlur,
    errors,
    touched,
    submitCount,
    setFieldValue,
    user
  } = props;

  const [addLoader, setAddLoader] = useState(false);
  const [files, setFiles] = useState([]);
  const [images, setImages] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [groupOptions, setGroupOptions] = useState([]);
  const [customerTypeOptions, setCustomerTypeOptions] = useState([]);
  const [serviceTypeOpt, setServiceTypeOpt] = useState([]);
  const [repeatCustomreOpt, setRepeatCustomerOpt] = useState([]);
  const [findUsOpt, setFindUsOpt] = useState([]);

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
      // @ts-ignore remove once typings fixed
      const componentType = component.types[0];

      switch (componentType) {
        case "street_number": {
          address1 += component.long_name;
          break;
        }
        case "route": {
          address1 === ""
            ? (address1 += component.long_name)
            : (address1 += `, ${component.long_name}`);
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

  const handleCustomerSubmit = async e => {
    e.preventDefault();
    handleSubmit();
    var formData = new FormData();
    for (const property in values) {
      formData.append(property, values[property]);
    }
    formData.append(`user_id`, user.id);
    for (let i = 0; i < files.length; i++) {
      formData.append(`customer_files`, files[i]);
    }

    for (let j = 0; j < images.length; j++) {
      formData.append(`customer_images`, images[j]);
    }

    if (isValid) {
      setAddLoader(true);
      await addCustomer(token, formData).then(data => {
        if (data.success) {
          success(data.message);
          setAddLoader(false);
          let group_id = values.group_id;
          let status_id = values.status_id;
          if (status_id === undefined) {
            group_id = 1;
            status_id = 1;
          }
          props.history.push(`/customer-entries/${group_id}/${status_id}/list`);
        } else {
          error(data.message);
          setAddLoader(false);
        }
      });
    }
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

  const getStatusData = async () => {
    await getStatusFromGroup(token, {
      group_id: values.group_id
    }).then(data => {
      if (data.success) {
        setStatusOptions(data.data.map(x => ({ value: x.id, label: x.name })));
      }
    });
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
    getStatusData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.group_id]);

  useEffect(() => {
    // if (user.stripe_public_key === null || user.stripe_secret_key === null) {
    //   error("Please first add stripe details to add customer");
    //   props.history.push("/settings");
    // }
    fetching();
    getGroupsData();
    getMarketingDataOpt();

    // getUserRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container-fluid">
      {addLoader ? (
        <CardLoader />
      ) : (
        <>
          <div className="row title-sec align-items-center">
            <div className="col-sm headline">Customer Entry Form</div>
          </div>
          <div className="div-container">
            <Row>
              <Col sm={12} md={6} lg={4}>
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
              <Col sm={12} md={6} lg={4}>
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
              <Col sm={12} md={6} lg={4}>
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
              <Col sm={12} md={6} lg={4}>
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
              <Col sm={12} md={6} lg={4}>
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
              <Col sm={12} md={6} lg={4}>
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
              <Col sm={12} md={6} lg={4}>
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
              <Col sm={12} md={6} lg={4}>
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
              <Col sm={12} md={6} lg={4}>
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
              <Col sm={12} md={6} lg={4}>
                <div className="form-group">
                  <label>Upload File</label>
                  <input
                    type="file"
                    className="form-control react-form-input"
                    id="customer_files"
                    accept=".pdf,.doc,.docx,.csv"
                    value={undefined}
                    onChange={e => {
                      if (e.target.files.length > 0) {
                        var fileArr = Array.from(e.target.files);
                        var fileSize = true;
                        for (var i = 0; i < fileArr.length; i++) {
                          var numb = fileArr[i].size / 1024 / 1024;
                          numb = numb.toFixed(2);
                          if (numb > 10) {
                            error(
                              "Maximum filesize is 10 mb. Your file size is: " +
                                numb +
                                " MiB"
                            );
                            fileSize = false;
                            break;
                          }
                        }
                        if (errors) {
                          setFiles([]);
                        }

                        if (fileSize) {
                          handleChange(e);
                          setFiles(fileArr);
                          setFieldValue("customer_files", fileArr);
                        } else {
                          setFieldValue("customer_files", []);
                          setFiles([]);
                        }
                      } else {
                        setFieldValue("customer_files", []);
                        setFiles([]);
                      }
                    }}
                    multiple
                    onBlur={handleBlur}
                    placeholder="Upload file"
                  />
                  <span className="small text-muted d-block">
                    Only allowed .pdf, .doc, .docx, .csv
                  </span>
                  <Error field="customer_files" />

                  <div>
                    {errors.customer_files
                      ? null
                      : files.map((x, i) => (
                          <p
                            className="border my-1 p-1 file-info-p"
                            key={`key_${i}`}
                          >
                            {x.name}
                          </p>
                        ))}
                  </div>
                </div>
              </Col>
              <Col sm={12} md={6} lg={4}>
                <div className="form-group">
                  <label>Upload Image</label>
                  <input
                    type="file"
                    className="form-control react-form-input"
                    id="customer_images"
                    value={undefined}
                    onChange={e => {
                      if (e.target.files.length > 0) {
                        var fileArr = Array.from(e.target.files);
                        var fileSize = true;
                        for (var i = 0; i < fileArr.length; i++) {
                          if (check_file_size(fileArr[i], 10)) {
                            error("Max file upload size is 10 MB.");
                            fileSize = false;
                            break;
                          }
                        }

                        if (fileSize) {
                          handleChange(e);
                          setImages(fileArr);
                          setFieldValue("customer_images", fileArr);
                        } else {
                          setFieldValue("customer_images", []);
                          setImages([]);
                        }
                      } else {
                        setFieldValue("customer_images", []);
                        setImages([]);
                      }
                    }}
                    multiple
                    onBlur={handleBlur}
                    accept=".jpg,.jpeg,.png,.webp,.gif"
                    placeholder="Upload image"
                  />
                  <span className="small text-muted d-block">
                    Only allowed .jpg, .jpeg, .png, .gif, .webp
                  </span>
                  <Error field="customer_images" />
                  <div>
                    {errors.customer_images
                      ? null
                      : images.map((x, i) => (
                          <p
                            className="border my-1 p-1 file-info-p"
                            key={`key_${i}`}
                          >
                            {x.name}
                          </p>
                        ))}
                  </div>
                </div>
              </Col>

              <Col sm={12} md={6} lg={4}>
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
              <Col sm={12} md={6} lg={4}>
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
            <hr />

            <h6 className="pb-3">Marketing Data</h6>
            <Row>
              <Col lg={3} md={6} sm={12}>
                <div className="form-group">
                  <label>Customer Type</label>
                  <Select
                    id="customer_type_id"
                    value={customerTypeOptions.find(
                      x => x.value === values.customer_type_id
                    )}
                    placeholder="Please Select"
                    onChange={e => {
                      setFieldValue(
                        "customer_type_id",
                        e === null ? "" : e.value
                      );
                    }}
                    options={customerTypeOptions}
                  />
                  <Error field="customer_type_id" />
                </div>
              </Col>
              <Col lg={3} md={6} sm={12}>
                <div className="form-group">
                  <label>Service Type</label>
                  <Select
                    id="service_type_id"
                    value={serviceTypeOpt.find(
                      x => x.value === values.service_type_id
                    )}
                    placeholder="Please Select"
                    onChange={e => {
                      setFieldValue(
                        "service_type_id",
                        e === null ? "" : e.value
                      );
                    }}
                    options={serviceTypeOpt}
                  />
                  <Error field="service_type_id" />
                </div>
              </Col>
              <Col lg={3} md={6} sm={12}>
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
              </Col>
              <Col lg={3} md={6} sm={12}>
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
              </Col>
            </Row>
            <div className="col-12 text-center border-top pt-4 mt-4">
              <div className="row justify-content-center">
                <div className="col-sm-auto pr-sm-2">
                  <button
                    // style={buttonBack}
                    disabled={addLoader}
                    type="button"
                    onClick={e => handleCustomerSubmit(e)}
                    className="btn btn-blue w-100 mb-3"
                  >
                    Save
                  </button>
                </div>
                <div className="col-sm-auto pl-sm-2">
                  <button
                    type="button"
                    // style={buttonBack}
                    className="btn btn-bordered w-100"
                    onClick={() => props.history.goBack()}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
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
  enhancer,
  connect(mapStateToProps, { success, error, fetching, setuser })
)(CustomerAdd);

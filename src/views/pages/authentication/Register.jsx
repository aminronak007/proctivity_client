import React, { useEffect, useState } from "react";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import enhancer from "./enhancer/RegisterFormEnhancer";
import { register } from "services/authServices";
import NavigationActions from "redux/navigation/actions";
import Logo from "../../../assets/images/proctivity_logo.svg";
import loginBgImg from "../../../assets/images/login-img.jpg";
import { connect } from "react-redux";
import {
  Briefcase,
  Lock,
  Mail,
  Phone,
  User,
  MapPin,
  Map,
  Home
} from "react-feather";
import { usePlacesWidget } from "react-google-autocomplete";
import ModalLoader from "components/common/ModalLoader";
import { processRequestMsg } from "helper/constant";

const { success, error, fetching } = NavigationActions;

const Register = props => {
  const { success, error, fetching, isFetching } = props;

  const [logo, setLogo] = useState();
  console.log(logo);
  // const [errMsg, setError] = useState("");
  const handleRegister = async e => {
    let { values, isValid, handleSubmit } = props;
    e.preventDefault();
    if (isValid) {
      fetching();
      var formData = new FormData();
      for (const property in values) {
        formData.append(property, values[property]);
      }
      formData.append("logo", logo);
      await register(formData).then(data => {
        if (data.success) {
          success(data.message);
          props.history.push("/login");
        } else {
          error(data.message);
        }
      });
    }

    handleSubmit();
  };

  const {
    handleChange,
    handleBlur,
    setFieldValue,
    errors,
    values,
    touched,
    submitCount,
    setValues
  } = props;

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
    let address1 = "";
    let postcode = "";
    let state = "";
    let city = "";
    for (const component of place.address_components) {
      // @ts-ignore remove once typings fixed
      const componentType = component.types[0];

      switch (componentType) {
        case "street_number": {
          address1 = `${component.long_name} ${address1}`;
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

    setFieldValue("address_line1", address1);
    setFieldValue("city", city);
    setFieldValue("state", state);
    setFieldValue("postal_code", postcode);
  };

  useEffect(() => {
    setValues({
      ...values,
      address_line1: values?.address_line1 ? values?.address_line1 : "",
      postal_code: values?.postal_code ? values?.postal_code : "",
      city: values?.city ? values?.city : "",
      state: values?.state ? values?.state : ""
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // console.log(logo);

  return (
    <div className="container-fluid">
      <div className="row login-page register-page">
        <div className="col-lg-6 align-self-center login-main">
          <div className="shape-bg"></div>
          <div className="login-inner-content">
            <div className="login-icon text-center">
              <img src={Logo} alt="logo" className="img-fluid" />
            </div>
            <div className="form-container">
              {isFetching ? (
                <div className="py-3 my-3">
                  <ModalLoader message={processRequestMsg} />
                </div>
              ) : (
                <>
                  <div className="login-title">
                    Sign Up!
                    <span>Please create your account.</span>
                  </div>
                  <form onSubmit={handleRegister}>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <User className="form-icons" />
                          <label>
                            User Name <span className="error-msg">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control react-form-input"
                            id="username"
                            name="username"
                            onChange={handleChange}
                            value={values.username}
                            onBlur={handleBlur}
                            placeholder="Enter your name"
                          />
                          <Error field="username" />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <Briefcase className="form-icons" />
                          <label>
                            Company Name <span className="error-msg">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control react-form-input"
                            id="companyname"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.companyname}
                            placeholder="Enter company name"
                          />
                          <Error field="companyname" />
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <Mail className="form-icons" />
                      <label>
                        Email <span className="error-msg">*</span>
                      </label>
                      <input
                        type="email"
                        className="form-control react-form-input"
                        id="email"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter your email"
                        value={values.email}
                      />
                      <Error field="email" />
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <Phone className="form-icons" />
                          <label>
                            Phone <span className="error-msg">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control react-form-input"
                            id="phone"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Enter your phone"
                            value={values.phone}
                          />
                          <Error field="phone" />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>
                            Upload Logo <span className="error-msg">*</span>
                          </label>
                          <input
                            type="file"
                            className="form-control react-form-input"
                            id="logo"
                            accept=".jpg,.png,.jpeg"
                            onBlur={handleBlur}
                            onChange={e => {
                              if (e.target.files.length > 0) {
                                var fileArr = Array.from(e.target.files);

                                if (fileArr?.length > 0) {
                                  // handleChange(e);
                                  setLogo(fileArr[0]);
                                  setFieldValue("logo", fileArr);
                                } else {
                                  setFieldValue("logo", []);
                                  setLogo("");
                                }
                              }
                            }}
                            placeholder="Compnay Logo"
                          />
                          <span className="small text-muted d-block">
                            Only allowed .jpg, .jpeg, .png
                          </span>
                          <Error field="logo" />
                          {/* <span className='error-msg d-block'>{errMsg}</span> */}
                        </div>
                      </div>
                      <div className="col-md-6">
                        {/* <div className='form-group'>
                      <label>
                        Brand Color <span className='error-msg'>*</span>
                      </label>
                      <input
                        type='color'
                        className='form-control react-form-input'
                        // id='brandcolor'
                        // onChange={handleChange}
                        // onBlur={handleBlur}
                        placeholder='Brand Color'
                        // value={values.brandcolor}
                        value='#ffffff'
                      />
                      <span className='small text-muted d-block'>
                        Select brand color
                      </span>
                      <Error field='brandcolor' />
                    </div> */}
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-12">
                        {" "}
                        <div className="form-group">
                          <MapPin className="form-icons" />
                          <label>
                            Address
                            <span className="error-msg">*</span>
                          </label>
                          <textarea
                            type="text"
                            className="form-control react-form-input"
                            id="address_line1"
                            onChange={handleChange}
                            value={values.address_line1}
                            onBlur={handleBlur}
                            placeholder="Address"
                            ref={ref}
                          />
                          <Error field="address_line1" />
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-4">
                        <div className="form-group">
                          <Map className="form-icons" />
                          <label>
                            State <span className="error-msg">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control react-form-input"
                            id="state"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.state}
                            placeholder="State"
                          />
                          <Error field="state" />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <Home className="form-icons" />
                          <label>
                            City <span className="error-msg">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control react-form-input"
                            id="city"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.city}
                            placeholder="City"
                          />
                          <Error field="city" />
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="form-group">
                          <MapPin className="form-icons" />
                          <label>
                            Postal Code <span className="error-msg">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control react-form-input"
                            id="postal_code"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.postal_code}
                            placeholder="Postal Code"
                          />
                          <Error field="postal_code" />
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <Lock className="form-icons" />
                      <label>
                        Password <span className="error-msg">*</span>
                      </label>
                      <input
                        type="password"
                        className="form-control react-form-input"
                        id="password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter Password"
                        value={values.password}
                      />
                      <Error field="password" />
                    </div>

                    <button type="submit" className="btn form-button btn-blue">
                      Sign Up
                    </button>
                    <div className="text-center mt-3">
                      Already have an account?{" "}
                      <label
                        className="link-label"
                        onClick={() => props.history.push("/login")}
                      >
                        Sign in
                      </label>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-6 d-none d-lg-block pr-0 login-img">
          <img src={loginBgImg} alt="logo" className="img-fluid" />
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = state => {
  return {
    isFetching: state.navigation.isFetching
  };
};

export default compose(
  withRouter,
  enhancer,
  connect(mapStateToProps, { success, error, fetching })
)(Register);

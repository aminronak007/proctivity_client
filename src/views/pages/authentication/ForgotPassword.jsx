import React, { useState } from "react";

import { forgotPassword } from "services/authServices";
import enhancer from "./enhancer/ForgotPasswordEnhancer";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import NavigationActions from "redux/navigation/actions";
import logo from "../../../assets/images/proctivity_logo.svg";
import loginBgImg from "../../../assets/images/login-img.jpg";
import LoaderComponent from "components/common/LoaderComponent";
import { Mail } from "react-feather";

const { success, error, fetching } = NavigationActions;

const ForgotPassword = props => {
  const { success, error, fetching, isFetching } = props;
  const [emailSent, setEmailSent] = useState(false);

  const {
    values,
    handleChange,
    handleBlur,
    errors,
    touched,
    submitCount
  } = props;

  const handleForgotPassword = async e => {
    const { values, isValid, handleSubmit } = props;
    e.preventDefault();
    handleSubmit();
    if (isValid) {
      fetching();
      await forgotPassword(values).then(data => {
        if (data.success) {
          success(data.message);
          setEmailSent(true);
        } else {
          error(data.message);
        }
      });
    }
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

  return isFetching ? (
    <LoaderComponent />
  ) : (
    <div className="container-fluid">
      <div className="row login-page">
        <div className="col-lg-6 align-self-center login-main">
          <div className="shape-bg"></div>
          <div className="login-inner-content">
            <div className="login-icon text-center">
              <img src={logo} alt="logo" className="img-fluid" />
            </div>
            {emailSent ? (
              <div className="form-container">
                <div className="circle-mail-icon">
                  <Mail />
                </div>
                <div className="login-title text-center">CHECK YOUR EMAIL</div>
                <div className="text-center">
                  We sent a password reset link to{" "}
                  <span style={{ fontWeight: "bold" }}>{values.email}</span>
                </div>
                <form>
                  <div className="text-center text-center my-4">
                    <p
                      className="back-to-login"
                      onClick={() => props.history.push("/login")}
                    >
                      Back to Login
                    </p>
                  </div>
                </form>
              </div>
            ) : (
              <div className="form-container">
                <div className="login-title">
                  Forgot Password ?
                  <span>
                    Provide your e-mail address to reset your password
                  </span>
                </div>
                <form onSubmit={handleForgotPassword}>
                  <div className="form-group">
                    <label>
                      Email <span className="error-msg">*</span>
                    </label>
                    <Mail className="form-icons" />
                    <input
                      type="email"
                      className="form-control react-form-input"
                      id="email"
                      aria-describedby="emailHelp"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                      placeholder="Enter email"
                    />
                    <Error field="email" />
                  </div>
                  <button
                    type="submit"
                    className="btn form-button btn-blue mt-3"
                  >
                    Get Link
                  </button>
                  <div className="text-center form-info-text mt-3">
                    <p
                      className="back-to-login"
                      onClick={() => props.history.push("/login")}
                    >
                      Back to Login
                    </p>
                  </div>
                </form>
              </div>
            )}
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
)(ForgotPassword);

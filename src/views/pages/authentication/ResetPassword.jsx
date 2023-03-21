import React, { useState } from "react";

import { resetPassword } from "services/authServices";
import enhancer from "./enhancer/ResetPasswordEnhancer";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import NavigationActions from "redux/navigation/actions";
import { useParams } from "react-router-dom";
import logo from "../../../assets/images/proctivity_logo.svg";
import loginBgImg from "../../../assets/images/login-img.jpg";
import { CheckCircle, Lock } from "react-feather";

const { success, error, fetching } = NavigationActions;

const ResetPassword = props => {
  let { token } = useParams();
  const { success, error } = props;
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);

  const {
    values,
    handleChange,
    handleBlur,
    errors,
    touched,
    submitCount,
    fetching
  } = props;

  const handleResetPassword = async e => {
    const { values, isValid, handleSubmit } = props;
    e.preventDefault();
    handleSubmit();

    if (isValid) {
      fetching();
      await resetPassword(values, token).then(data => {
        if (data.success) {
          setPasswordResetSuccess(true);
          success(data.message);
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

  return (
    <div className="container-fluid">
      {passwordResetSuccess ? (
        <div className="row login-page">
          <div className="col-lg-6 align-self-center login-main">
            <div className="shape-bg"></div>
            <div className="login-inner-content">
              <div className="login-icon text-center">
                <img src={logo} alt="logo" className="img-fluid" />
              </div>
              <div className="form-container">
                <div className="circle-mail-icon success-circle">
                  <CheckCircle />
                </div>
                <div className="login-title text-center">
                  PASSWORD RESET
                  <span>Your password has been successfully reset.</span>
                </div>
                <form className="pa-24">
                  <div className="text-center form-info-text">
                    <p
                      className="back-to-login text-center my-4"
                      onClick={() => props.history.push("/login")}
                    >
                      Back to Login
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-lg-6 d-none d-lg-block pr-0 login-img">
            <img src={loginBgImg} alt="logo" className="img-fluid" />
          </div>
        </div>
      ) : (
        <div className="row login-page">
          <div className="col-lg-6 align-self-center login-main">
            <div className="shape-bg"></div>
            <div className="login-inner-content">
              <div className="login-icon text-center">
                <img src={logo} alt="logo" className="img-fluid" />
              </div>

              <div className="form-container">
                <div className="login-title">
                  SET NEW PASSWORD
                  <span>
                    Your new password must be different to previously used
                    password.
                  </span>
                </div>
                <form
                  className="form-with-icons"
                  onSubmit={handleResetPassword}
                >
                  <div className="form-group">
                    <Lock className="form-icons" />
                    <label>
                      Password <span className="error-msg">*</span>
                    </label>
                    <input
                      type="password"
                      className="form-control react-form-input"
                      id="newpassword"
                      aria-describedby="emailHelp"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.newpassword}
                      placeholder="Password"
                    />
                    <Error field="newpassword" />
                  </div>
                  <div className="form-group">
                    <Lock className="form-icons" />
                    <label>
                      Confirm Password <span className="error-msg">*</span>
                    </label>
                    <input
                      type="password"
                      className="form-control react-form-input"
                      id="confirmpassword"
                      aria-describedby="emailHelp"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.confirmpassword}
                      placeholder="Confirm Password"
                    />
                    <Error field="confirmpassword" />
                  </div>
                  <button type="submit" className="btn form-button btn-blue">
                    Reset Password
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-lg-6 d-none d-lg-block pr-0 login-img">
            <img src={loginBgImg} alt="logo" className="img-fluid" />
          </div>
        </div>
      )}
    </div>
  );
};

export default compose(
  withRouter,
  enhancer,
  connect(null, { success, error, fetching })
)(ResetPassword);

import React, { useEffect, useState } from "react";
import logo from "../../../assets/images/proctivity_logo.svg";
import loginBgImg from "../../../assets/images/login-img.jpg";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import AuthActions from "redux/auth/actions";
import NavigationActions from "redux/navigation/actions";
import enhancer from "./enhancer/LoginFormEnhancer";
import { checkApi, loginApi } from "services/authServices";
import { Eye, EyeOff, Lock, Mail } from "react-feather";
import LoaderComponent from "components/common/LoaderComponent";

const { login, check } = AuthActions;
const {
  success,
  error,
  toggleOneTimeModal,
  fetching,
  toggleSubscriptionLoader
} = NavigationActions;
const Login = props => {
  const {
    token,
    success,
    error,
    values,
    handleChange,
    toggleSubscriptionLoader,
    handleBlur,
    errors,
    touched,
    submitCount,
    toggleOneTimeModal,
    fetching,
    isFetching
  } = props;
  const [pwdView, togglePwdView] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const checkLogin = async () => {
    fetching();
    await checkApi(token).then(data => {
      if (data.success) {
        check(data.data);
        toggleSubscriptionLoader(false);
        success();
        props.history.push("/intro");
      } else {
        error();
      }
    });
  };

  useEffect(() => {
    token !== null && checkLogin();
    // eslint-disable-next-line
  }, []);
  const handleLogin = async e => {
    let { values, isValid, handleSubmit } = props;
    e.preventDefault();
    handleSubmit();
    if (isValid) {
      fetching();
      await loginApi(values).then(data => {
        if (data.success) {
          success(data.message);
          props.login(data.data);
          if (rememberMe) {
            var date = new Date();
            date.setDate(date.getDate() + 7);
            document.cookie = `token=${data.data.token} ;SameSite=strict;expires=${date}`;
          }
          if (data.data.access_key_send) {
            props.history.push("/change-password");
          } else {
            if (!data.data.package?.expired) {
              if (Object.keys(data.data?.package).length === 0) {
                toggleOneTimeModal(true);
              } else if (
                data.data?.package?.package_type === "Trial" ||
                (data.data?.package?.package_type !== "Trial" &&
                  data.data.package?.difference_in_days <= 5)
              ) {
                toggleOneTimeModal(true);
              }
            }
            props.history.push("/intro");
          }
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
    <div className="row text-center">
      <LoaderComponent />
    </div>
  ) : (
    <div className="container-fluid">
      <div className="row login-page">
        <div className="col-lg-6 align-self-center login-main">
          <div className="shape-bg"></div>
          <div className="login-inner-content">
            <div className="login-icon text-center">
              <img src={logo} alt="logo" className="img-fluid" />
            </div>
            <div className="form-container">
              <div className="login-title">
                Login!
                <span>Please login your account.</span>
              </div>
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label>Email</label>
                  <Mail className="form-icons" />
                  <input
                    type="email"
                    className="form-control react-form-input"
                    id="email"
                    onChange={handleChange}
                    value={values.email}
                    onBlur={handleBlur}
                    placeholder="Enter your email"
                  />
                  <Error field="email" />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <Lock className="form-icons" />
                  <div className="input-group">
                    <input
                      type={pwdView ? "text" : "password"}
                      className="form-control react-form-input"
                      id="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter password"
                      style={{
                        borderRight: "0px",
                        borderBottomRightRadius: "0px",
                        borderTopRightRadius: "0px"
                      }}
                    />
                    <div className="input-group-append thead-dark">
                      <button
                        className="btn btn-link react-form-input"
                        type="button"
                        style={{
                          borderLeft: "0px",
                          borderBottomLeftRadius: "0px",
                          borderTopLeftRadius: "0px"
                        }}
                        onClick={() => togglePwdView(!pwdView)}
                      >
                        {pwdView ? (
                          <EyeOff className="sm-svg" />
                        ) : (
                          <Eye className="sm-svg" />
                        )}
                      </button>
                    </div>
                  </div>
                  <Error field="password" />
                </div>
                <div className="row">
                  <div className="col">
                    <div className="custom-control custom-checkbox form-check">
                      <input
                        type="checkbox"
                        className="form-check-input custom-control-input"
                        id="exampleCheck1"
                        value={rememberMe}
                        onChange={e => setRememberMe(e.target.checked)}
                      />
                      <label
                        className="custom-control-label form-check-label"
                        htmlFor="exampleCheck1"
                      >
                        Keep me logged in
                      </label>
                    </div>
                  </div>
                  <div className="col">
                    <div
                      className="text-right link-label"
                      onClick={() => props.history.push("/forgotPassword")}
                    >
                      Forgot Password ?
                    </div>
                  </div>
                </div>
                <button type="submit" className="btn form-button btn-blue mt-4">
                  Login
                </button>
                <div className="text-center mt-3">
                  Don't have an account ?{" "}
                  <label
                    className="link-label"
                    onClick={() => props.history.push("/register")}
                  >
                    Sign Up
                  </label>
                </div>
              </form>
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
    token: state.auth.accessToken,
    isFetching: state.navigation.isFetching
  };
};
export default compose(
  withRouter,
  enhancer,
  connect(mapStateToProps, {
    check,
    login,
    success,
    error,
    toggleOneTimeModal,
    toggleSubscriptionLoader,
    fetching
  })
)(Login);

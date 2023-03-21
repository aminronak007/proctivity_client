import React, { useEffect, useState } from "react";
import logo from "../../../assets/images/proctivity_logo.svg";
import loginBgImg from "../../../assets/images/login-img.jpg";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter, useParams } from "react-router-dom";
import AuthActions from "redux/auth/actions";
import NavigationActions from "redux/navigation/actions";
import enhancer from "./enhancer/LoginFormEnhancer";
import { LoginUsingId } from "services/authServices";
import { Eye, EyeOff, Lock, Mail } from "react-feather";
import LoaderComponent from "components/common/LoaderComponent";

const { login, check } = AuthActions;
const { success, error, toggleOneTimeModal, fetching } = NavigationActions;
const LoginAs = props => {
  const {
    success,
    error,
    values,

    fetching
  } = props;

  const { id } = useParams();

  const LoginById = async () => {
    fetching();
    await LoginUsingId(id).then(data => {
      if (data.success) {
        success(data.message);
        props.login(data.data);
        props.history.push("/intro");
      } else {
        error(data.message);
      }
    });
  };

  useEffect(() => {
    LoginById();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="row text-center">
      <LoaderComponent />
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
    fetching
  })
)(LoginAs);

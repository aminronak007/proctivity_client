import { logoutApi } from "services/authServices";

const authActions = {
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  SET_USER: "SET_USER",

  login: data => {
    localStorage.setItem("isLogin", true);
    localStorage.setItem("accessToken", data.token);
    return {
      type: authActions.LOGIN,
      isLogin: true,
      accessToken: data.token,
      user: data
    };
  },
  check: data => {
    localStorage.setItem("isLogin", true);
    localStorage.setItem("accessToken", data.token);
    return {
      type: authActions.LOGIN,
      isLogin: true,
      accessToken: data.token,
      user: data
    };
  },

  setuser: data => {
    return {
      type: authActions.SET_USER,
      user: data
    };
  },
  logout: token => {
    if (token !== null) {
      logoutApi(token).then(data => {});
    }
    localStorage.setItem("isLogin", false);
    localStorage.setItem("accessToken", null);
    document.cookie = document.cookie = `token= ;SameSite=strict;max-age=0}`;
    return {
      type: authActions.LOGOUT,
      isLogin: false,
      accessToken: null
    };
  }
};

export default authActions;

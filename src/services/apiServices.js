import axios from "axios";

const BACKEND_URI = process.env.REACT_APP_BACKEND_URI
  ? process.env.REACT_APP_BACKEND_URI
  : "";

export const api = token => {
  if (typeof token === "string" && token.split(".").length === 3)
    return axios.create({
      // withCredentials: true,
      baseURL: `${BACKEND_URI}/`,
      headers: { Authorization: token }
    });
  else
    return axios.create({
      // withCredentials: true,
      baseURL: `${BACKEND_URI}/`
    });
};

export const handleResponse = res => {
  try {
    const data = res.data;
    if (res.data.error) {
      const error = data.message ? data.message : data.error;
      return Promise.reject(error);
    }
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const handleError = err => {
  console.log(window.location.pathname);
  if (err.response.status === 401) {
    localStorage.setItem("isLogin", false);
    localStorage.setItem("accessToken", null);
    document.cookie = document.cookie = `token= ;SameSite=strict;max-age=0}`;
    if (window.location.pathname !== "/login") {
      window.location = "/login";
    }
  }
  console.log();
  return err.response.data;
};

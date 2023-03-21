import { api, handleResponse, handleError } from "./apiServices";

export const getProfile = token =>
  api(token)
    .get("/user/profile")
    .then(handleResponse)
    .catch(handleError);

export const editProfile = (token, id, data) =>
  api(token)
    .put(`user/edit-profile/${id}`, data)
    .then(handleResponse)
    .catch(handleError);

export const changePassword = (token, id, data) =>
  api(token)
    .put(`/user/change-password/${id}`, data)
    .then(handleResponse)
    .catch(handleError);

export const updateCardDetails = (token, id, data) =>
  api(token)
    .put(`/user/edit-card/${id}`, data)
    .then(handleResponse)
    .catch(handleError);

export const getUserDetails = (token, id) =>
  api(token)
    .get(`/user/details/${id}`)
    .then(handleResponse)
    .catch(handleResponse);

export const getUserPackageDetails = (token, id) =>
  api(token)
    .get(`/user/package/details/${id}`)
    .then(handleResponse)
    .catch(handleResponse);

export const addUserAddressDetails = (token, id, data) =>
  api(token)
    .put(`/user/update/address/${id}`, data)
    .then(handleResponse)
    .catch(handleResponse);

export const requestFreeTrial = (token, user_id) =>
  api(token)
    .post(`/user/request/free-trial`, user_id)
    .then(handleResponse)
    .catch(handleError);

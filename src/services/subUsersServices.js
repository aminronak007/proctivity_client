import { api, handleResponse, handleError } from "./apiServices";

export const getSubUsers = (token, pId, params) =>
  api(token)
    .post(`/user/sub_user/get_all/${pId}`, params)
    .then(handleResponse)
    .catch(handleError);

export const addSubUser = (token, pId, data) =>
  api(token)
    .post(`/user/sub_user/create/${pId}`, data)
    .then(handleResponse)
    .catch(handleError);

export const updateSubUser = (token, id, data) =>
  api(token)
    .put(`user/sub_user/update/${id}`, data)
    .then(handleResponse)
    .catch(handleError);

export const deleteSubUser = (token, id) =>
  api(token)
    .delete(`/user/sub_user/delete/${id}`)
    .then(handleResponse)
    .catch(handleError);

export const viewSubUser = (token, id) =>
  api(token)
    .get(`/user/sub_user/view/${id}`)
    .then(handleResponse)
    .catch(handleError);

export const sendAccessKey = (token, data) =>
  api(token)
    .post(`/user/sub_user/send_access_key`, data)
    .then(handleResponse)
    .catch(handleError);

export const updateSubUserStatus = (token, data) =>
  api(token)
    .put(`/user/sub_user/update-status`, data)
    .then(handleResponse)
    .catch(handleError);

export const GetUserPermissions = (token, data) =>
  api(token)
    .post(`/user/permissions/GetUserPermissions`, data)
    .then(handleResponse)
    .catch(handleError);

export const GetUserGroupPermissions = (token, data) =>
  api(token)
    .post(`/user/permissions/GetUserGroupPermissions`, data)
    .then(handleResponse)
    .catch(handleError);
export const CreateOrUpdatePermissions = (token, data) =>
  api(token)
    .post(`/user/permissions/create_or_update_permissions`, data)
    .then(handleResponse)
    .catch(handleError);

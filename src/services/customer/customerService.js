import { api, handleResponse, handleError } from "../apiServices";

export const addCustomer = (token, data) =>
  api(token)
    .post("/customer/add/details", data)
    .then(handleResponse)
    .catch(handleError);

export const updateCustomer = (token, id, data) =>
  api(token)
    .put(`/customer/update/details/${id}`, data)
    .then(handleResponse)
    .catch(handleError);

export const deleteCustomer = (token, id) =>
  api(token)
    .delete(`/customer/delete/${id}`)
    .then(handleResponse)
    .catch(handleError);

export const ViewCustomer = (token, id) =>
  api(token)
    .get(`/customer/${id}/view`)
    .then(handleResponse)
    .catch(handleError);

export const getStatusFromGroup = (token, data) =>
  api(token)
    .post(`/customer/groups/status`, data)
    .then(handleResponse)
    .catch(handleError);

export const getCustomerList = (token, data) =>
  api(token)
    .post(`/customer/list`, data)
    .then(handleResponse)
    .catch(handleError);

export const assignStatus = (token, data) =>
  api(token)
    .put(`/customer/assign-status`, data)
    .then(handleResponse)
    .catch(handleError);

export const assignUser = (token, data) =>
  api(token)
    .put(`/customer/assign-user`, data)
    .then(handleResponse)
    .catch(handleError);

export const UserList = (token, data) =>
  api(token)
    .get(`/customer/user-list`, data)
    .then(handleResponse)
    .catch(handleError);

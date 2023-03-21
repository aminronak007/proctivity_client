import { api, handleResponse, handleError } from "../../apiServices";

export const AddCustomerEvent = (token, data) =>
  api(token)
    .post(`/customer/add/event`, data)
    .then(handleResponse)
    .catch(handleError);

export const EditCustomerEvent = (token, data, id) =>
  api(token)
    .put(`/customer/event/${id}/edit`, data)
    .then(handleResponse)
    .catch(handleError);

export const DeleteCustomerEvent = (token, id) =>
  api(token)
    .delete(`/customer/event/${id}/delete`)
    .then(handleResponse)
    .catch(handleError);
export const GetCustomerEvent = (token, data) =>
  api(token)
    .post(`/customer/event/get`, data)
    .then(handleResponse)
    .catch(handleError);

import { api, handleResponse, handleError } from "../../apiServices";

export const getInvoicesByCustomerId = (token, c_id, data) =>
  api(token)
    .post(`/invoice/${c_id}/all`, data)
    .then(handleResponse)
    .catch(handleError);

export const downloadInvoiceByCustomerId = (token, data) =>
  api(token)
    .post(`/invoice/downloadinvoice`, data)
    .then(handleResponse)
    .catch(handleError);

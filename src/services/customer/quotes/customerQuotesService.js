import { api, handleResponse, handleError } from "../../apiServices";

export const getQuotesByCustomerId = (token, c_id, data) =>
  api(token)
    .post(`/quote/${c_id}/all`, data)
    .then(handleResponse)
    .catch(handleError);

export const getQuotesById = (token, id) =>
  api(token)
    .get(`/quote/${id}/detail`)
    .then(handleResponse)
    .catch(handleError);

export const getQuoteDetailsByQuoteID = (id, user_id) =>
  api()
    .get(`/quote/${id}/${user_id}/quote-details`)
    .then(handleResponse)
    .catch(handleError);

export const deleteQuoteById = (token, id) =>
  api(token)
    .delete(`/quote/${id}/delete`)
    .then(handleResponse)
    .catch(handleError);

export const addQuotes = (token, data) =>
  api(token)
    .post("/quote/create", data)
    .then(handleResponse)
    .catch(handleError);

export const updateQuotes = (token, id, data) =>
  api(token)
    .post(`/quote/${id}/update`, data)
    .then(handleResponse)
    .catch(handleError);

export const FinalizeQuote = (token, id, data) =>
  api(token)
    .post(`/quote/${id}/finalize`, data)
    .then(handleResponse)
    .catch(handleError);

export const CancelQuote = (id, data) =>
  api()
    .post(`/quote/${id}/cancel`, data)
    .then(handleResponse)
    .catch(handleError);

export const AcceptQuote = (id, data) =>
  api()
    .post(`/quote/${id}/accept`, data)
    .then(handleResponse)
    .catch(handleError);

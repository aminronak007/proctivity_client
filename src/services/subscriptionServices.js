import { api, handleResponse, handleError } from "./apiServices";

export const userSubscribe = (token, id, data) =>
  api(token)
    .post(`/subscribe/create_checkout/${id}`, data)
    .then(handleResponse)
    .catch(handleError);

export const success_subscription = (token, id) =>
  api(token)
    .get(`/subscribe/success_subscription/${id}`)
    .then(handleResponse)
    .catch(handleError);

export const CancelUserSubscription = (token, data) =>
  api(token)
    .post(`/subscribe/cancel_subscription/`, data)
    .then(handleResponse)
    .catch(handleError);

export const update_autorenew = (token, data) =>
  api(token)
    .post("/subscribe/update_autorenew", data)
    .then(handleResponse)
    .catch(handleError);

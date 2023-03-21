import { api, handleResponse, handleError } from "./apiServices";

export const updateStripeDetails = (token, data) =>
  api(token)
    .post(`user/update_stripe_details`, data)
    .then(handleResponse)
    .catch(handleError);

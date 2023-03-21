import { api, handleResponse, handleError } from "./apiServices";

export const getMarketingData = (token, flag) =>
  api(token)
    .get(`/marketing/data/${flag}`)
    .then(handleResponse)
    .catch(handleError);

export const addMarketingData = (token, data) =>
  api(token)
    .post("/marketing/data/add", data)
    .then(handleResponse)
    .catch(handleError);

export const updateMarketingData = (token, data) =>
  api(token)
    .put("/marketing/data/update", data)
    .then(handleResponse)
    .catch(handleError);

export const deleteMarketingData = (token, data) =>
  api(token)
    .delete("/marketing/data/delete", { data: data })
    .then(handleResponse)
    .catch(handleError);

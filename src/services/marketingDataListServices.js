import { api, handleResponse, handleError } from "./apiServices";

export const getMarketingDataList = (token, data) =>
  api(token)
    .post(`/marketing-data-list`, data)
    .then(handleResponse)
    .catch(handleError);

export const updateMarketingDataList = (token, data) =>
  api(token)
    .put("/marketing-data-list/update", data)
    .then(handleResponse)
    .catch(handleError);

export const deleteMarketingDataList = (token, data) =>
  api(token)
    .delete("/marketing-data-list/delete", { data: data })
    .then(handleResponse)
    .catch(handleError);

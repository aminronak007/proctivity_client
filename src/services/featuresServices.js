import { api, handleResponse, handleError } from "./apiServices";

export const getFeatures = token =>
  api(token)
    .get("/features/list")
    .then(handleResponse)
    .catch(handleError);

export const addFeature = (token, data) =>
  api(token)
    .post("/features/add", data)
    .then(handleResponse)
    .catch(handleError);

export const updateFeature = (token, data) =>
  api(token)
    .put("/features/update", data)
    .then(handleResponse)
    .catch(handleError);

export const deleteFeature = (token, data) =>
  api(token)
    .delete("/features/delete", { data: data })
    .then(handleResponse)
    .catch(handleError);

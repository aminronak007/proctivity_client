import { api, handleResponse, handleError } from "./apiServices";

export const getStatus = token =>
  api(token)
    .get("/group/status/list")
    .then(handleResponse)
    .catch(handleError);

export const addStatus = (token, data) =>
  api(token)
    .post("/group/status/add", data)
    .then(handleResponse)
    .catch(handleError);

export const updateStatus = (token, data) =>
  api(token)
    .put("/group/status/update", data)
    .then(handleResponse)
    .catch(handleError);

export const deleteStatus = (token, data) =>
  api(token)
    .delete("/group/status/delete", { data: data })
    .then(handleResponse)
    .catch(handleError);

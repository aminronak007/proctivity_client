import { api, handleResponse, handleError } from "./apiServices";

export const getGroups = token =>
  api(token)
    .get("/group/list")
    .then(handleResponse)
    .catch(handleError);

export const addGroupAndStatus = (token, data) =>
  api(token)
    .post("/groups/status/add", data)
    .then(handleResponse)
    .catch(handleError);

export const updateGroup = (token, data) =>
  api(token)
    .put("/group/status/update", data)
    .then(handleResponse)
    .catch(handleError);

export const deleteGroup = (token, id) =>
  api(token)
    .delete(`/group/delete/${id}`)
    .then(handleResponse)
    .catch(handleError);

export const GetGroupStatusHirarchy = token =>
  api(token)
    .get("/group/GetGroupStatusHirarchy")
    .then(handleResponse)
    .catch(handleError);

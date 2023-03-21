import { api, handleResponse, handleError } from "./apiServices";

export const getPackages = token =>
  api(token)
    .get("/packages/get_package")
    .then(handleResponse)
    .catch(handleError);

export const editPackages = (token, data) =>
  api(token)
    .put("/packages/edit", data)
    .then(handleResponse)
    .catch(handleError);

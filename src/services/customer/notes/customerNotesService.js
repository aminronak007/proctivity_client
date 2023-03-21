import { api, handleResponse, handleError } from "../../apiServices";

export const getNotesByCustomerId = (token, c_id) =>
  api(token)
    .get(`/customer/notes/${c_id}`)
    .then(handleResponse)
    .catch(handleError);

export const deleteNoteById = (token, id) =>
  api(token)
    .delete(`/customer/delete/notes/${id}`)
    .then(handleResponse)
    .catch(handleError);

export const addNotes = (token, data) =>
  api(token)
    .post("/customer/add/notes", data)
    .then(handleResponse)
    .catch(handleError);

export const updateNotes = (token, id, data) =>
  api(token)
    .put(`/customer/update/notes/${id}`, data)
    .then(handleResponse)
    .catch(handleError);

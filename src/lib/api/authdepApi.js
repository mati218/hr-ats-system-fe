import api from "./axios";

export const getDepartments = () => {
    return api.get("/departments");
};

export const getDepartment = (id) => {
  return api.get(`/departments/${id}`);
};

export const createDepartment = (data) => {
    return api.post("/departments", data);
};

export const updateDepartment = (id, data) => {
    return api.put(`/departments/${id}`, data);
};

export const deleteDepartment = (id) => {
  return api.delete(`/departments/${id}`);
};

export const getRolesLookup = () => {
  return api.get("/lookups/roles");
};

export const getDepartmentLookup = () => {
  return api.get("/lookups/departments");
};
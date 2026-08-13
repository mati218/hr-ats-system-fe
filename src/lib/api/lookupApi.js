import api from "./axios";

export const getRolesLookup = () => {
  return api.get("/lookups/roles");
};

export const getEmploymentTypesLookup = () => {
  return api.get("/lookups/employment-types");
};

export const getUsersLookup = (role) => {
  return api.get("/lookups/users", { params: role ? { role } : {} });
};
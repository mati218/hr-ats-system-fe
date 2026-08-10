import api from "./axios";

export const getRolesLookup = () => {
  return api.get("/lookups/roles");
};

export const getEmploymentTypesLookup = () => {
  return api.get("/lookups/employment-types");
};
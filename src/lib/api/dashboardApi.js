import api from "./axios";

export const getDashboard = (date) => {
  return api.get("/dashboard", {
    params: {
      date,
    },
  });
};
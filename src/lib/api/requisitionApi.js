import api from "./axios";

export const getRequisitions = () => {
  return api.get("/requisitions");
};

export const getRequisition = (id) => {
  return api.get("/requisitions/" + id);
};

export const createRequisition = (data) => {
  const token = localStorage.getItem("token");

  return api.post("/requisitions", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateRequisition = (id, data) => {
  const token = localStorage.getItem("token");

  return api.put("/requisitions/" + id, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteRequisition = (id) => {
  const token = localStorage.getItem("token");

  return api.delete("/requisitions/" + id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
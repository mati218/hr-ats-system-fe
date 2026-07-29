import api from "./axios";

export const registerUser = (data) => {
  return api.post("/auth/register", data);
};

export const loginUser = (data) => {
  return api.post("/auth/login", data);
};

export const ForgotPasswordApi = (data) => {
  return api.post("/auth/forgot-password", data);
};
export const ResetPasswordApi = (data) => {
  return api.post("/auth/reset-password", data);
};

export const createUser = (data) => {
  const token = localStorage.getItem("token");

  return api.post(
    "/user",
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const updateUser = (id, data) => {
  const token = localStorage.getItem("token");

  return api.put("/user/" + id, data, {
  headers: {
    Authorization: "Bearer " + localStorage.getItem("token"),
  },
})
};
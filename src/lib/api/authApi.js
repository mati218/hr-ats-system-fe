import api from "./axios";

export const registerUser = (data) => {
  return api.post("/auth/register", data);
};

export const loginUser = (data) => {
  return api.post("/auth/login", data);
};

export const ForgotPasswordApi = (data) => {
  return api.post(
    "/auth/forgot-password",
    data
  );
};

export const ResetPasswordApi = ({
  token,
  password,
  confirmPassword,
}) => {
  return api.post(
    `/auth/reset-password/${token}`,
    {
      password,
      confirmPassword,
    }
  );
};

export const createUser = (data) => {
  return api.post("/user", data);
};

export const updateUser = (
  id,
  data
) => {
  return api.put(
    `/user/${id}`,
    data
  );
};

export const getUsers = () => {
  return api.get("/user");
};
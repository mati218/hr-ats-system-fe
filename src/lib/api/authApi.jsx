import api from "./axios";

const loginUser = (data) => {
  return api.post("/auth/login", data);
};

export default loginUser;


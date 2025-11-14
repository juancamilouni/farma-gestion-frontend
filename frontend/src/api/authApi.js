import api from "../config/api";

export const loginRequest = (credentials) => {
  return api.post("/usuarios/login", credentials);
};

import api from "../config/api";

export const getUsuarios = async () => {
  return api.get("/api/usuarios/");
};

import api from "../config/api";

export const getDashboardData = (rol) => api.get(`/dashboard/${rol}`);

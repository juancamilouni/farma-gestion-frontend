import axios from "axios";

// En CRA, las variables deben comenzar con REACT_APP_
const baseURL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      console.error(`❌ [${error.response.status}] ${error.response.config.url}`);
      console.error("Detalles:", error.response.data);
    } else {
      console.error("❌ Error de conexión con el backend:", error.message);
    }
    throw error;
  }
);

export default api;

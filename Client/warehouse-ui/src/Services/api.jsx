import axios from "axios";

const API_URL = "https://localhost:7234/api";
const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (username, password) => {
  const response = await api.post("/Auth/login", { username, password });

  return response.data;
};

export const register = async (user) => {
  const response = await api.post("/Auth/register", user);

  return response.data;
};

export default api;

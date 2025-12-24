import axios from "axios";
import Cookies from "universal-cookie";
import { baseURL } from "../../config/Api"; 

const cookie = new Cookies();

export const httpClient = axios.create({
  baseURL: baseURL,
  withCredentials: false,
  headers: {
    Accept: "application/json",
  },
});

httpClient.interceptors.request.use((config) => {
  const token = cookie.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

httpClient.interceptors.request.use((config) => {
  if (config.method?.toLowerCase() === "get") {
    config.params = { ...(config.params || {}), _t: Date.now() };
    config.headers["Cache-Control"] = "no-cache";
  }
  return config;
});

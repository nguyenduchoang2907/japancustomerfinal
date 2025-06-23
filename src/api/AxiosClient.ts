
import axios from "axios";


const axiosClient = axios.create({
  baseURL: "https://api.vnpt-hn.io.vn/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error", error);

    if (error.response?.status === 401) {
      localStorage.removeItem("token"); 
      window.location.href = "/account/login"; 
    }

    return Promise.reject(error);
  }
);

export default axiosClient;

import axios from "axios";

// Agar frontend localhost pe chal raha hai to local backend use karega
// Agar deploy (vercel) pe chal raha hai to render ka backend use karega
const API = axios.create({
  baseURL:
    window.location.hostname === "localhost"
      ? "http://localhost:5000/api"  // 👈 Local backend
      : "https://foodsharebackendnew.onrender.com/api", // 👈 Render backend
  withCredentials: true,
});

// Optional: token auto add
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

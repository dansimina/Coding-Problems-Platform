import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api", // sau 'http://localhost:8080/api' dacă nu folosești proxy
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
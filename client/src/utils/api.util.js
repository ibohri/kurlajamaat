import axios from "axios";

let api = axios.create({
  baseURL: "/",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const statusCode = error.response ? error.response.status : null;
    if (statusCode === 404) {
      window.location.href = "/";
    }

    if (statusCode === 401) {
      window.location.href = "/logout";
    }
    throw error;
  }
);

export default api;

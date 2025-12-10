import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
});

// Add token to requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Register user
export const registerUser = async (formData) => {
  const res = await API.post("/api/auth/register", formData);
  return res.data;
};

// Login user with Firebase token
export const loginUser = async (firebaseToken) => {
  const res = await API.post("/api/auth/login", {
    firebaseToken,
  });
  return res.data;
};

// Get user by email
export const getUserByEmail = async (email) => {
  const res = await API.get(`/api/auth/user/${email}`);
  return res.data;
};

export default API;

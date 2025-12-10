import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Backend URL
});

// Register user
export const registerUser = async (formData) => {
  const res = await API.post("/auth/register", formData);
  return res.data;
};

// Login user
export const loginUser = async (formData) => {
  const res = await API.post("/auth/login", formData);
  return res.data;
};

// Get current user (protected)
export const getMe = async (token) => {
  const res = await API.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

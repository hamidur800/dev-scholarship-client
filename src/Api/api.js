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

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Scholarship API calls
export const scholarshipApi = {
  getAll: (params) => API.get("/api/scholarships", { params }),
  getTop: () => API.get("/api/scholarships/top"),
  getById: (id) => API.get(`/api/scholarships/${id}`),
  create: (data) => API.post("/api/scholarships", data),
  update: (id, data) => API.put(`/api/scholarships/${id}`, data),
  delete: (id) => API.delete(`/api/scholarships/${id}`),
};

// Application API calls
export const applicationApi = {
  getAll: () => API.get("/api/applications"),
  getByUser: (userId) => API.get(`/api/applications/user/${userId}`),
  getById: (id) => API.get(`/api/applications/${id}`),
  create: (data) => API.post("/api/applications", data),
  update: (id, data) => API.put(`/api/applications/${id}`, data),
  updateStatus: (id, data) => API.put(`/api/applications/${id}/status`, data),
  updatePayment: (id, data) => API.put(`/api/applications/${id}/payment`, data),
  delete: (id) => API.delete(`/api/applications/${id}`),
};

// Review API calls
export const reviewApi = {
  getByScholarship: (scholarshipId) =>
    API.get(`/api/reviews/scholarship/${scholarshipId}`),
  getByUser: (userEmail) => API.get(`/api/reviews/user/${userEmail}`),
  getAll: () => API.get("/api/reviews"),
  create: (data) => API.post("/api/reviews", data),
  update: (id, data) => API.put(`/api/reviews/${id}`, data),
  delete: (id) => API.delete(`/api/reviews/${id}`),
};

// Admin API calls
export const adminApi = {
  getUsers: (role) => API.get("/api/admin/users", { params: { role } }),
  updateUserRole: (id, data) => API.put(`/api/admin/users/${id}/role`, data),
  deleteUser: (id) => API.delete(`/api/admin/users/${id}`),
  getAnalytics: () => API.get("/api/admin/analytics"),
};

// Payment API calls
export const paymentApi = {
  createPaymentIntent: (data) => API.post("/api/payments/intent", data),
  confirmPayment: (data) => API.post("/api/payments/confirm", data),
};

// User API calls
export const userApi = {
  getAll: (params) => API.get("/api/users", { params }),
  getById: (id) => API.get(`/api/users/${id}`),
  update: (id, data) => API.put(`/api/users/${id}`, data),
  delete: (id) => API.delete(`/api/users/${id}`),
  changeRole: (id, role) => API.put(`/api/users/${id}/role`, { role }),
  getCurrentUser: () => API.get("/api/users/me"),
};

// Payment API calls
export const paymentApi = {
  createPaymentIntent: (data) => API.post("/api/payments/create-intent", data),
  confirmPayment: (data) => API.post("/api/payments/confirm", data),
};

export default API;

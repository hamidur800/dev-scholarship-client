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

// Scholarship API calls
export const scholarshipApi = {
  getAll: (params) => API.get("/api/scholarships", { params }),
  getById: (id) => API.get(`/api/scholarships/${id}`),
  create: (data) => API.post("/api/scholarships", data),
  update: (id, data) => API.put(`/api/scholarships/${id}`, data),
  delete: (id) => API.delete(`/api/scholarships/${id}`),
  search: (query) => API.get(`/api/scholarships/search?q=${query}`),
};

// Application API calls
export const applicationApi = {
  getAll: (params) => API.get("/api/applications", { params }),
  getById: (id) => API.get(`/api/applications/${id}`),
  create: (data) => API.post("/api/applications", data),
  update: (id, data) => API.put(`/api/applications/${id}`, data),
  delete: (id) => API.delete(`/api/applications/${id}`),
  getMyApplications: () => API.get("/api/applications/my-applications"),
};

// Review API calls
export const reviewApi = {
  getByScholarship: (scholarshipId) =>
    API.get(`/api/reviews/scholarship/${scholarshipId}`),
  getAll: (params) => API.get("/api/reviews", { params }),
  create: (data) => API.post("/api/reviews", data),
  update: (id, data) => API.put(`/api/reviews/${id}`, data),
  delete: (id) => API.delete(`/api/reviews/${id}`),
  getMyReviews: () => API.get("/api/reviews/my-reviews"),
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

import axios from "axios";

// Create axios instance with base configuration
const API = axios.create({
    baseURL: "http://localhost:5000",
    headers: {
        "Content-Type": "application/json"
    }, timeout: 10000
});

// Request interceptor for adding auth tokens if needed
API.interceptors.request.use(
    (config) => {
        // You can add auth tokens here if needed
        const adminAuth = localStorage.getItem("adminAuth");
        if (adminAuth) {
            try {
                const authData = JSON.parse(adminAuth);
                // If you have a token, add it to headers
                // config.headers.Authorization = `Bearer ${authData.token}`;
            } catch (err) {
                console.error("Error parsing auth data");
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling errors
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Unauthorized - clear auth and redirect
            localStorage.removeItem("adminAuth");
            window.location.href = "/booking";
        }
        return Promise.reject(error);
    }
);

// Admin booking management APIs
export const confirmBooking = (id) => API.patch(`/api/booking/${id}/confirm`);
export const rejectBooking = (id, reason) => API.patch(`/api/booking/${id}/reject`, { reason });
export const getAllBookings = (status) => API.get("/api/booking/all", { params: { status } });
export const getPendingBookings = () => API.get("/api/booking/pending");
export const getConfirmedBookings = () => API.get("/api/booking/all", { params: { status: "confirmed" } });
export const getBookingById = (id) => API.get(`/api/booking/${id}`);

// Admin authentication APIs
export const adminLogin = (credentials) => API.post("/api/admin/login", credentials);
export const setupAdmin = () => API.post("/api/admin/setup");

export default API;

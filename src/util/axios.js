import axios from "axios";

// Determine the base URL based on environment
const getBaseURL = () => {
    // If running in production (deployed), use the Render backend URL
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        return 'https://hall-1-6ub7.onrender.com'; // Replace with your actual Render backend URL
    }
    // For local development
    return 'https://hall-1-6ub7.onrender.com';
};

// Create axios instance with base configuration
const API = axios.create({
    baseURL: getBaseURL(),
    headers: {
        "Content-Type": "application/json"
    },
    timeout: 30000  // Increased to 30 seconds for password reset operations
});

const APIForLogin = axios.create({
    baseURL: getBaseURL(),
    headers: {
        "Content-Type": "application/json"
    },
    timeout: 30000  // Increased to 30 seconds
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



// Admin booking management APIs
export const confirmBooking = (id) => API.patch(`/api/booking/${id}/confirm`, {});
export const rejectBooking = (id, reason) => API.patch(`/api/booking/${id}/reject`, { reason });
export const getAllBookings = (status) => API.get("/api/booking/all", { params: { status } });
export const getPendingBookings = () => API.get("/api/booking/pending");
export const getConfirmedBookings = () => API.get("/api/booking/all", { params: { status: "confirmed" } });
export const getBookingById = (id) => API.get(`/api/booking/${id}`);

// Admin authentication APIs
export const adminLogin = (credentials) => APIForLogin.post("/api/admin/login", credentials);
export const setupAdmin = () => API.post("/api/admin/setup");

// Forgot password APIs
export const requestPasswordReset = (email) => API.post("/api/admin/forgot-password", { email });
export const verifyOTP = (email, otp) => API.post("/api/admin/verify-otp", { email, otp });
export const resetPassword = (email, otp, newPassword) => API.post("/api/admin/reset-password", { email, otp, newPassword });

export default API;

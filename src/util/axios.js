import axios from "axios";

const API = axios.create({
  baseURL: "https://hall-3-0.onrender.com",
  timeout: 30000, // 30 seconds timeout for slow operations like email sending
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true
});

// Public booking APIs
export const sendBooking = (data) => API.post("/api/booking", data);
export const getBlockedDates = () => API.get("/api/booking/blocked-dates");

export default API;

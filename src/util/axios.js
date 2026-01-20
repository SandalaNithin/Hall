import axios from "axios";

const API = axios.create({
  baseURL: "https://hall-1-6ub7.onrender.com",
});

// Public booking APIs
export const sendBooking = (data) => API.post("/api/booking", data);
export const getBlockedDates = () => API.get("/api/booking/blocked-dates");

export default API;

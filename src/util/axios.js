import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

// Public booking APIs
export const sendBooking = (data) => API.post("/api/booking", data);
export const getBlockedDates = () => API.get("/api/booking/blocked-dates");

export default API;

import axios from "axios";
import authHeader from "./auth-header";

const API_URL = import.meta.env.VITE_API_URL + "attendance/";

const clockIn = (photoFile, location, notes) => {
  let formData = new FormData();
  if (photoFile) {
    formData.append("photo", photoFile);
  }
  if (location) {
    formData.append("location", location);
  }
  if (notes) formData.append("notes", notes);

  return axios.post(API_URL + "clockin", formData, {
    headers: {
      ...authHeader(),
      "Content-Type": "multipart/form-data",
    },
  });
};

const clockOut = (location) => {
  return axios.put(
    API_URL + "clockout",
    { location },
    { headers: authHeader() }
  );
};

const getHistory = () => {
  return axios.get(API_URL + "history", { headers: authHeader() });
};

const getTodayStatus = () => {
  return axios.get(API_URL + "today", { headers: authHeader() });
};

const getReports = (startDate, endDate, department) => {
  let params = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  if (department) params.department = department;

  return axios.get(API_URL + "reports", { 
    headers: authHeader(),
    params: params
  });
};

const AttendanceService = {
  clockIn,
  clockOut,
  getHistory,
  getTodayStatus,
  getReports,
};

export default AttendanceService;

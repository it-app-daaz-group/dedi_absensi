import axios from "axios";
import authHeader from "./auth-header";

const API_URL = (import.meta.env.VITE_API_URL || "/api/") + "hr/";

const getSettings = () => {
  return axios.get(API_URL + "settings", { headers: authHeader() });
};

const updateSettings = (data) => {
  return axios.put(API_URL + "settings", data, { headers: authHeader() });
};

const getHolidays = () => {
  return axios.get(API_URL + "holidays", { headers: authHeader() });
};

const addHoliday = (data) => {
  return axios.post(API_URL + "holidays", data, { headers: authHeader() });
};

const deleteHoliday = (id) => {
  return axios.delete(API_URL + "holidays/" + id, { headers: authHeader() });
};

const HrService = {
  getSettings,
  updateSettings,
  getHolidays,
  addHoliday,
  deleteHoliday,
};

export default HrService;

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "auth/";

const register = (nip, name, email, password) => {
  return axios.post(API_URL + "signup", {
    nip,
    name,
    email,
    password,
  });
};

const login = (nip, password) => {
  return axios
    .post(API_URL + "signin", {
      nip,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default authService;

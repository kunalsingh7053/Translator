import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api", // backend base URL
  withCredentials: true, // send cookies automatically
});

export default API;

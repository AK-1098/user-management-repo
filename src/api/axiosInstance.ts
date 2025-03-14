import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://reqres.in/api",
  headers: {
    "Content-Type": "application/json"
  }
});

export default apiClient;

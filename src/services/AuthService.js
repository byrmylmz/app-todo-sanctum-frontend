import axios from "axios";
import store from "@/store";

export const authClient = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  withCredentials: true, // required to handle the CSRF token
});

/*
 * Add a response interceptor
 */
authClient.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    if (
      error.response &&
      [401, 419].includes(error.response.status) &&
      store.getters["auth/authUser"] &&
      !store.getters["auth/guest"]
    ) {
      store.dispatch("auth/logout");
    }
    return Promise.reject(error);
  }
);

export default {
  async login(payload) {
    await authClient.get("/sanctum/csrf-cookie");
    return authClient.post("/api/login", payload);
  },
  logout() {
    return authClient.post("/api/logout");
  },
  async forgotPassword(payload) {
    await authClient.get("/sanctum/csrf-cookie");
    return authClient.post("api/forgot-password", payload);
  },
  getAuthUser() {
    return authClient.get("/api/users/auth");
  },
  async resetPassword(payload) {
    await authClient.get("/sanctum/csrf-cookie");
    return authClient.post("/api/reset-password", payload);
  },
  updatePassword(payload) {
    return authClient.put("/api/user/password", payload);
  },
  async registerUser(payload) {
    await authClient.get("/sanctum/csrf-cookie");
    return authClient.post("/api/register", payload);
  },
  sendVerification(payload) {
    return authClient.post("/api/email/verification-notification", payload);
  },
  updateUser(payload) {
    return authClient.put("/api/user/profile-information", payload);
  },
};

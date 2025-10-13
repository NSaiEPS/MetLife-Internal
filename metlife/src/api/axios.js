import { message } from "antd";
import axios from "axios";

// export const SERVER_URL = "https://unfegr.eplanetsoft.com/";
export const SERVER_URL = "https://unfegr-dev.eplanetsoft.com/";

export const BASE_URL = `${SERVER_URL}api/v1/`;

export const api = axios.create({
  baseURL: BASE_URL,
});
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error("Error status:", error.response.status);
      if (error.response.status === 401 && error.config.url !== "users/login") {
        console.log("User is not authorized. Logging out...");
        message.info("Session Expired");
        localStorage.clear();
        window.location.reload();
      }
      message.destroy();

      message.error(error?.response?.data?.message);
      return Promise.reject(error.response.data); // Return the error response data
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received");
      message.error("Unable to connect. Please check your network and try again.");
      return Promise.reject(
        "Unable to connect. Please check your network and try again."
      );
    } else {
      // Something happened in setting up the request that triggered an error
      console.error("An unexpected error occurred:", error.message);
      return Promise.reject(
        "An unexpected error occurred. Please try again later."
      ); // Return custom error message
    }
  }
);

export default api;

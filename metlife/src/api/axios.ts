import { message } from "antd";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";

// export const SERVER_URL = "https://oneframeapi.com/";
export const SERVER_URL = import.meta.env.VITE_BACKEND_URL;

export const BASE_URL = `${SERVER_URL}`;

export const api = axios.create({
  baseURL: BASE_URL,
  // headers: {
  //   // "Content-Type": "application/json",
  //   Accept: "application/json",
  // },
});

// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     if (error.response) {
//       console.error("Error status:", error.response.status);
//       if (error.response.status === 401 && error.config.url !== "users/login") {
//         console.log("User is not authorized. Logging out...");
//         message.info("Session Expired");
//         localStorage.clear();
//         window.location.reload();
//       }
//       message.destroy();

//       message.error(error?.response?.data?.message);
//       return Promise.reject(error.response.data); // Return the error response data
//     } else if (error.request) {
//       // The request was made but no response was received
//       console.error("No response received");
//       message.error(
//         "Unable to connect. Please check your network and try again."
//       );
//       return Promise.reject(
//         "Unable to connect. Please check your network and try again."
//       );
//     } else {
//       // Something happened in setting up the request that triggered an error
//       console.error("An unexpected error occurred:", error.message);
//       return Promise.reject(
//         "An unexpected error occurred. Please try again later."
//       ); // Return custom error message
//     }
//   }
// );

api.interceptors.request.use((config) => {
  const token = secureLocalStorage.getItem("token") as string | null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error?.response?.status === 401 &&
      !window.location.pathname.includes("/login")
    ) {
      secureLocalStorage.removeItem("token");
      secureLocalStorage.removeItem("userDetails");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default api;

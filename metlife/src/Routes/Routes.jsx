// src/router/router.jsx
import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

// Pages
import LoginPage from "../Pages/LoginPage/LoginPage";
import RegisterPage from "../Pages/Register/RegisterPage";
import ForgotPassword from "../Pages/ForgotPassword/ForgotPassword";
import VideoCreationOptions from "../Pages/OneFrame/OneFrame";

// Layout (wraps protected routes)
import LoginLayout from "../components/Login/Login"; // Assuming this is your layout

// Utils
import { getToken, getLoggedInUserType, USERS } from "../utils";

// ✅ Protected Route Component
const ProtectedRoute = ({ element, allowedRoles = [] }) => {
  const token = getToken();
  const userType = getLoggedInUserType();





  return element;
};

// ✅ Authorization for public-only pages (e.g., login, register)
const Authorization = ({ element }) => {
  const token = getToken();

  if (token) {
    return <Navigate to="/" replace />;
  }

  return element;
};

// ✅ Final Router Configuration
export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Authorization element={<LoginPage />} />,
  },
  {
    path: "/register",
    element: <Authorization element={<RegisterPage />} />,
  },
  {
    path: "/recover-password",
    element: <Authorization element={<ForgotPassword />} />,
  },
  {
    path: "/forget-password",
    element: <Authorization element={<ForgotPassword />} />,
  },
  {
    path: "/vedio-frame",
    element: <VideoCreationOptions />, // This is your app shell or layout
    // children: [
    //   {
    //     path: "vedio-frame", // ⚠️ fix the spelling to "video-frame" if needed
    //       element:<VideoCreationOptions />
       
    //   },
    //   // Add more protected routes here...
    // ],
  },
]);

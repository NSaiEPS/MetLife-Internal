// src/router/router.jsx
import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

// Pages
import LoginPage from "../Pages/LoginPage/LoginPage";
import RegisterPage from "../Pages/Register/RegisterPage";
import ForgotPassword from "../Pages/ForgotPassword/ForgotPassword";
import VideoCreationOptions from "../Pages/OneFrame/OneFrame";
import UploadScript from '../Pages/UploadScriptPage/UploadScript'
import GenerateScript from "../Pages/GenerateScipt/GenerateScript"
import GenerateVisualsPage from "../Pages/GenerateVisualPage/GenerateVisualPage"
import VideoProgressPage from '../Pages/VedioPregressPage/VedioProgressvideo'
import UploadClipsPage from '../Pages/UploadVedioPage/UploadVideoPage'
import ScriptPage from '../Pages/AddNewScriptPage/AddNewScriptPage'
import LoginLayout from "../components/Login/Login"; // Assuming this is your layout
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
    path: "/",
    element: <Authorization element={<LoginPage />} />,
  },
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
    path: "/video-frame",
    element: <VideoCreationOptions />
  },
  {
    path : "/upload-script",
    element : <UploadScript/>
  },
  {
    path : "/generate-script",
    element : <GenerateScript/>
  },
  {
    path : "/generate-visual-page",
    element :<GenerateVisualsPage/>
  },
  {
    path : "video-upload",
    element : <VideoProgressPage/>
  },
   {
    path : "upload-generated-clips",
    element : <UploadClipsPage/>
  },
   {
    path : "new-script",
    element : <ScriptPage/>
  }
]);

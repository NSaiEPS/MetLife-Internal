// src/router/router.jsx
import React from "react";
import type { ReactElement } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

// Pages
import LoginPage from "../Pages/LoginPage/LoginPage";
import RegisterPage from "../Pages/Register/RegisterPage";
import ForgotPassword from "../Pages/ForgotPassword/ForgotPassword";
import VideoCreationOptions from "../Pages/OneFrame/OneFrame";
import UploadScript from "../Pages/UploadScriptPage/UploadScript";
import TranslatedScript from "../Pages/TrannslatedScript/TranslatedScript";
import GenerateScript from "../Pages/GenerateScipt/GenerateScript";
import VideoProgressPage from "../Pages/VedioPregressPage/VedioProgressvideo";
import UploadClipsPage from "../Pages/UploadVedioPage/UploadVideoPage";
import ScriptPage from "../Pages/AddNewScriptPage/AddNewScriptPage";
import { getToken, getLoggedInUserType, USERS } from "../utils";
import Layout from "../components/layout/Layout";
import MyVideosDashboard from "../Pages/Dashboard/Dashboard";
import CreateVisualContentPage from "../Pages/VisualContent/CreateVisualContentPage";
import GenerateVisualContentPage from "../Pages/VisualContent/GenerateVisualContentPage";
import AudioAnimationPage from "../Pages/AudioAnimation/AudioAnimationPage";
import AnimationPage from "../Pages/Animation/AnimationPage";
import UploadConversationalClipsPage from "../Pages/UploadConversation/UploadConversationClipsPage";

// ===============================
interface ProtectedRouteProps {
  element: ReactElement;
  allowedRoles?: string[];
}

// const ProtectedRoute = ({
//   element,
//   allowedRoles = [],
// }: ProtectedRouteProps) => {
//   const token = getToken();
//   const userType = getLoggedInUserType();

//   return element;
// };

const ProtectedRoute = ({
  element,
  allowedRoles = [],
}: ProtectedRouteProps) => {
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // if (allowedRoles.length > 0) {
  //   const userType = getLoggedInUserType();
  //   if (!allowedRoles.includes(userType)) {
  //     return <Navigate to="/login" replace />;
  //   }
  // }

  return element;
};

interface AuthorizationProps {
  element: ReactElement;
}

// const Authorization = ({ element }: AuthorizationProps) => {
//   const token = getToken();

//   // if (token) {
//   //   return <Navigate to="/" replace />;
//   // }

//   return element;
// };

const Authorization = ({ element }: AuthorizationProps) => {
  const token = getToken();

  if (token) {
    return <Navigate to="/video-frame" replace />;
  }

  return element;
};

// ✅ Final Router Configuration
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/video-frame" replace />,
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
    // element: <Layout />,
    element: <ProtectedRoute element={<Layout />} />,
    children: [
      {
        path: "/dashboard",
        element: <MyVideosDashboard />,
      },
      {
        path: "/video-frame",
        element: <VideoCreationOptions />,
      },
      {
        path: "/upload-script",
        element: <UploadScript />,
      },
      {
        path: "/translated-script",
        element: <TranslatedScript />,
      },
      {
        path: "/generate-script",
        element: <GenerateScript />,
      },
      {
        path: "/create-visual-content/:id",
        element: <CreateVisualContentPage />,
      },
      {
        path: "/generate-visual-page/:id",
        element: <GenerateVisualContentPage />,
      },
      {
        path: "/audio-animation-toolkit/:id",
        element: <AudioAnimationPage />,
      },
      {
        path: "/animation-page/:id",
        element: <AnimationPage />,
      },
      {
        path: "video-upload",
        element: <VideoProgressPage />,
      },
      {
        path: "/upload-conversational-clips/:id",
        element: <UploadConversationalClipsPage />,
      },
      {
        path: "upload-generated-clips",
        element: <UploadClipsPage />,
      },
      {
        path: "scenes/:id",
        element: <ScriptPage />,
      },
    ],
  },
]);

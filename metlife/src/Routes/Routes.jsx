import { createBrowserRouter, Navigate } from "react-router";
import LoginPage from "../Pages/LoginPage/LoginPage";
// import LoginPage from "../Pages/LoginPage";
// import MainLayout from "../Component/Layout";
// import Dashboard from "../Pages/Dashboard";
// import Campaign from "../Pages/Campaign";
// import Feedback from "../Pages/Feedback";
// import { getLoggedInUserType, getToken, USERS } from "../utils";
// import Reviews from "../Pages/Reviews/index";
// import Users from "../Pages/Users";
// import LocationDetails from "../Pages/LocationDetails";
// import CampaignDashBoard from "../Pages/Campaign/CampaignDashBoard";
// import CampaignDetails from "../Pages/Campaign/campaignDetails";
// import ForgetPasswordPage from "../Pages/FOrgetPassword";
// import ResetPasswordPage from "../Pages/ForgetPassword/ResetPassword";
// import ChangePasswordPage from "../Pages/ForgetPassword/ChangePassword";
// import InsightsDashboard from "../Pages/Insights/InsightsDashbBoard"
const ProtectedRoute = ({ element, allowedRoles = [], ...rest }) => {
//   return getToken() ? 
(
//     allowedRoles.includes(getLoggedInUserType()) ? (
//       element
//     ) : (
<>
      <Navigate to={"/"} />
      <Navigate to="/login" /></>
    )
//   ) : 
// (
//     <Navigate to="/login" />
//   );
};
// const Authorization = ({ element, allowedRoles, ...rest }) => {
//   return getToken() ? <Navigate to="/" /> : element;
// };

export const router = createBrowserRouter([

    {
        path:"/login",
        element: <LoginPage/>
    }
//   {
//     path: "/login",
//     element: <Authorization element={<LoginPage/>} />,
//   },
//   {
//     path: "/recover-password",
//     element: <Authorization element={<ForgetPasswordPage />} />,
//   },
//   {
//     path: "/reset-password",
//     element: <Authorization element={<ResetPasswordPage />} />,
//   },
//   {
//     path: "/feedback",
//     element: <Feedback />,
//   },
//   {
//     path: "/",
//     element: <MainLayout />,
//     children: [
//       {
//         path: "/",
//         index: true,
//         element: (
//           <ProtectedRoute
//             element={<Dashboard />}
//             allowedRoles={[USERS.SUPER_ADMIN, USERS.SUPPORT_USER]}
//           />
//         ),
//       },
//       {
//         path: "/campaign",
//         element: (
//           <ProtectedRoute
//             element={<CampaignDashBoard />}
//             allowedRoles={[USERS.SUPER_ADMIN]}
//           />
//         ),
//       },
//         {
//         path: "/insights",
//         element: (
//           <ProtectedRoute
//             element={<InsightsDashboard />}
//             allowedRoles={[USERS.SUPER_ADMIN]}
//           />
//         ),
//       },
//       {
//         path: "/create-campaign",
//         element: (
//           <ProtectedRoute
//             element={<Campaign />}
//             allowedRoles={[USERS.SUPER_ADMIN]}
//           />
//         ),
//       },
//       {
//         path: "/location/:id",
//         element: (
//           <ProtectedRoute
//             element={<LocationDetails />}
//             allowedRoles={[USERS.SUPER_ADMIN]}
//           />
//         ),
//       },
//       {
//         path: "/campaign/:id",
//         element: (
//           <ProtectedRoute
//             element={<CampaignDetails />}
//             allowedRoles={[USERS.SUPER_ADMIN]}
//           />
//         ),
//       },
//       {
//         path: "/reviews",
//         element: (
//           <ProtectedRoute
//             element={<Reviews />}
//             allowedRoles={[USERS.SUPER_ADMIN, USERS.SUPPORT_USER]}
//           />
//         ),
//       },
//       {
//         path: "/change-password",
//         element: (
//           <ProtectedRoute
//             element={<ChangePasswordPage />}
//             allowedRoles={[USERS.SUPER_ADMIN, USERS.SUPPORT_USER]}
//           />
//         ),
//       },
//       {
//         path: "/users",
//         element: (
//           <ProtectedRoute
//             element={<Users />}
//             allowedRoles={[USERS.SUPER_ADMIN]}
//           />
//         ),
//       },
//     ],
//   },
]);

// import "@ant-design/v5-patch-for-react-19";
// import "./App.css";
// import "antd/dist/reset.css";
// import { router } from "./Routes/Routes";
// import { RouterProvider } from "react-router";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { setRouter } from "./utils/navigate";
// function App() {
//   setRouter(router);
//   console.log("v1.0.4");
//   return (
//     <>
//       {/* <ToastBox /> */}
//       <ToastContainer
//         position="top-right"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop
//         closeOnClick
//         pauseOnHover
//         draggable
//         theme="colored"
//         toastStyle={{
//           display: "flex",
//           alignItems: "center",
//         }}
//       />
//       <RouterProvider router={router} />
//     </>
//   );
// }

// export default App;



import "@ant-design/v5-patch-for-react-19";
import "./App.css";
import "antd/dist/reset.css";
import { router } from "./Routes/Routes";
import { RouterProvider } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setRouter } from "./utils/navigate";
import { IconButton } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

function App({ mode, setMode }:any) {
  setRouter(router);

  const toggleTheme = () => {
    setMode(mode === "light" ? "dark" : "light");
  };

  console.log("v1.0.4");

  return (
    <>
      {/* Theme Toggle Button */}
      <div style={{ position: "fixed", top: 20, right: 20 }}>
        <IconButton onClick={toggleTheme}>
          {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme={mode}   // 🔥 yaha dynamic theme
        toastStyle={{
          display: "flex",
          alignItems: "center",
        }}
      />

      <RouterProvider router={router} />
    </>
  );
}

export default App;
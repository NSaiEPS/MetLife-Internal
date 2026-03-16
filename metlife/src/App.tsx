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
import { IconButton, useTheme } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useEffect } from "react";
import Starfield from "./components/Starfield";

function ThemeWatcher() {
  const theme = useTheme();

  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme.palette.mode);
  }, [theme.palette.mode]);

  return null;
}

function App({ mode, setMode }: any) {
  setRouter(router);

  const toggleTheme = () => {
    setMode(mode === "light" ? "dark" : "light");
  };

  console.log("v1.0.4");

  return (
    <>
      {/* Theme Toggle Button */}
      {/* <div style={{ position: "fixed", top: 20, right: 20, zIndex: 1000 }}>
        <IconButton onClick={toggleTheme}>
          {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
      </div> */}

      <ThemeWatcher />
      <Starfield />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={true}
        closeButton={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme={mode}
      />

      <RouterProvider router={router} />
    </>
  );
}

export default App;
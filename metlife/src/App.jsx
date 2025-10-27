import "@ant-design/v5-patch-for-react-19";
import "./App.css";
import "antd/dist/reset.css";
import { router } from "./Routes/Routes";
import { RouterProvider } from "react-router";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <>
      {/* <ToastBox /> */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
      <RouterProvider router={router} />
    </>
  );
}

export default App;

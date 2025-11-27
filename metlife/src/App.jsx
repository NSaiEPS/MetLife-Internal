import "@ant-design/v5-patch-for-react-19";
import "./App.css";
import "antd/dist/reset.css";
import { router } from "./Routes/Routes";
import { RouterProvider } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setRouter } from "./utils/navigate";
function App() {
  // let time = convertToISTParts("2025-11-27T11:10:46.277948");
  // console.log(time);

  // function getISTSecondDifference(timestamp) {
  //   const backendDate = new Date(timestamp);
  //   const now = new Date();

  //   // IST offset = +5:30 in ms
  //   const IST_OFFSET = 5.5 * 60 * 60 * 1000;

  //   // Convert both times to IST
  //   const backendIST = new Date(backendDate.getTime() + IST_OFFSET);
  //   const nowIST = new Date(now.getTime());
  //   console.log(backendIST, "backendIST", nowIST, "nowIST");
  //   // Difference in milliseconds
  //   const diffMs =  backendIST -nowIST;

  //   // Convert ms → seconds
  //   return Math.floor(diffMs / 1000);
  // }

  // Example
  // console.log(getISTSecondDifference("2025-11-27T11:50:46.277948"));
  setRouter(router);
  console.log("v1.0.2");
  return (
    <>
      {/* <ToastBox /> */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
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

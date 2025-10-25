import "@ant-design/v5-patch-for-react-19";
import "./App.css";
import "antd/dist/reset.css";
import { router } from "./Routes/Routes";
import { RouterProvider } from "react-router";
import ToastBox from "./components/common/ToastBox/index"

function App() {
  
  return( 
    <>
    <ToastBox />
  <RouterProvider router={router} /></>);
}

export default App;
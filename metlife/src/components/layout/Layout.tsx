import { Outlet } from "react-router";
import OneFrameHeader from "../common/OneFrameHeader";
import ScrollToTop from "../common/ScrollToTop";



const Layout = () => {
  return (
    <>
      <ScrollToTop />
      {/* Header */}
      <OneFrameHeader />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;

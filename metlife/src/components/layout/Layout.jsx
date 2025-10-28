import React from "react";
import { Outlet } from "react-router";
import OneFrameHeader from "../common/OneFrameHeader";
import styles from "../common/OneFrameHeader.module.css";

import Footer from "../common/mainFooter";

const Layout = () => {
  return (
    <>
      {/* Header */}
      {/* <OneFrameHeader /> */}
      <main>
        <Outlet />
      </main>
      {/* // Footer */}
      {/* <Footer /> */}
    </>
  );
};

export default Layout;

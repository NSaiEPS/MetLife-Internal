import React from "react";
import { Outlet } from "react-router";
import OneFrameHeader from "../common/OneFrameHeader";
import styles from "../common/OneFrameHeader.module.css";



const Layout = () => {
  return (
    <>
      {/* Header */}
      <OneFrameHeader />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;

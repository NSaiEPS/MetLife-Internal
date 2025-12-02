import type  { FC } from "react";
import { Outlet } from "react-router-dom";


const Layout: FC = () => {
  return (
    <>
      {/* Header */}
      {/* <OneFrameHeader /> */}

      <main>
        <Outlet />
      </main>

      {/* Footer */}
      {/* <Footer /> */}
    </>
  );
};

export default Layout;

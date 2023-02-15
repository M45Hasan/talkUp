import React from "react";
import { Outlet } from "react-router-dom";
import Head from "../component/Head";

const RootLayout = () => {
  return (
    <>
      <Head />
      <Outlet />
    </>
  );
};

export default RootLayout;

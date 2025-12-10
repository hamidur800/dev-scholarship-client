import React from "react";
import Header from "../Pages/Shared/Header/Header";
import { Outlet } from "react-router";
import Footer from "../Pages/Shared/Footer/Footer";

const ModaretorLayout = () => {
  return (
    <div>
      <div className="w-11/12 mx-auto">
        <Header />
        <Outlet />
        <Footer />
      </div>
    </div>
  );
};

export default ModaretorLayout;

import React from "react";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import SideNav from "./SideNav";

const Layout = ({ children }) => {
  return (
    <main className="w-screen h-screen relative overflow-hidden">
      <Navbar />
      <div className="flex flex-col lg:flex-row h-full">
        <SideNav />
        {children}
      </div>
      <Footer />
    </main>
  );
};

export default Layout;

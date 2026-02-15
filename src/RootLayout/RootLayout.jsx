import React from "react";
import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const RootLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <Navbar />
      </header>

      {/* Main content takes remaining space */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer added here */}
      <Footer />
    </div>
  );
};

export default RootLayout;

import React, { createContext, useContext } from "react";
import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useDarkMode from "../hooks/useDarkMode";

export const DarkModeContext = createContext({
  isDark: false,
  toggle: () => {},
});

export const useDarkModeContext = () => useContext(DarkModeContext);

const RootLayout = () => {
  const darkMode = useDarkMode();
  
  return (
    <DarkModeContext.Provider value={darkMode}>
      <div className="flex flex-col min-h-screen bg-(--bg-base) text-(--text-primary)">
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
    </DarkModeContext.Provider>
  );
};

export default RootLayout;

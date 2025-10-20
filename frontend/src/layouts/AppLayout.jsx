import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

const AppLayout = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-100">
      {/* 🔹 Sidebar fijo */}
      <Sidebar />

      {/* 🔹 Contenido principal */}
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-8 overflow-auto bg-gray-100">
          <Outlet /> {/* ✅ Aquí se montan Dashboard, Órdenes, etc. */}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;

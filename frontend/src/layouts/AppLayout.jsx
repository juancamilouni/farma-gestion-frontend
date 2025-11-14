import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";




const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-100">
      {/* 🔹 Sidebar */}
        <Sidebar />


      {/* 🔹 Contenido principal */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />
        <main className="flex-1 overflow-auto bg-gray-50 p-6 md:p-8 rounded-tl-2xl shadow-inner">
          <Outlet /> {/* ✅ Aquí se montan Dashboard, Órdenes, etc. */}
        </main>
      </div>

      {/* 🔹 Fondo semitransparente para móviles cuando el sidebar está abierto */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default AppLayout;

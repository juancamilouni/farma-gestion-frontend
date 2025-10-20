import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// 🧩 Layout principal
import AppLayout from "../layouts/AppLayout";

// 🧱 Páginas internas
import Dashboard from "../pages/Dashboard";
import Pacientes from "../pages/Pacientes";
import Items from "../pages/Items";
import Ordenes from "../pages/Ordenes";
import Reportes from "../pages/Reportes";
import Inventarios from "../pages/Inventarios";
import Usuarios from "../pages/Usuarios";
import Proveedores from "../pages/Proveedores";
import Ubicaciones from "../pages/Ubicaciones";
import Auditoria from "../pages/Auditoria";
import Comprobantes from "../pages/Comprobantes";

// 🔑 Login y Recuperar contraseña
import Login from "../pages/Login";
import RecuperarContrasena from "../pages/RecuperarContrasena"; // si aún no existe, créala luego

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔹 RUTAS PÚBLICAS */}
        <Route path="/login" element={<Login />} />
        <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />

        {/* 🔹 RUTAS PRIVADAS (envueltas en AppLayout) */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pacientes" element={<Pacientes />} />
          <Route path="/items" element={<Items />} />
          <Route path="/ordenes" element={<Ordenes />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="/inventarios" element={<Inventarios />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/proveedores" element={<Proveedores />} />
          <Route path="/ubicaciones" element={<Ubicaciones />} />
          <Route path="/auditoria" element={<Auditoria />} />
          <Route path="/comprobantes" element={<Comprobantes />} />
        </Route>

        {/* 🔹 Redirección por defecto */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 🔹 Página no encontrada */}
        <Route
          path="*"
          element={
            <div className="flex items-center justify-center h-screen text-gray-600">
              <h2 className="text-2xl font-semibold">
                404 | Página no encontrada
              </h2>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

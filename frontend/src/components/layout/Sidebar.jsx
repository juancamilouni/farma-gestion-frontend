import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaUserInjured,
  FaPills,
  FaFileMedical,
  FaChartLine,
  FaBoxes,
  FaUsers,
  FaClinicMedical,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";

const Sidebar = () => {
  const [expanded, setExpanded] = useState({
    dashboard: true,
    pacientes: false,
    medicamentos: false,
    ordenes: false,
    reportes: false,
    inventarios: false,
  });

  const toggleExpand = (key) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const menuItems = [
    { label: "Dashboard", icon: <FaHome />, path: "/dashboard" },
    { label: "Pacientes", icon: <FaUserInjured />, path: "/pacientes" },
    { label: "Medicamentos", icon: <FaPills />, path: "/items" },
    { label: "Órdenes", icon: <FaFileMedical />, path: "/ordenes" },
    { label: "Reportes", icon: <FaChartLine />, path: "/reportes" },
    { label: "Inventarios", icon: <FaBoxes />, path: "/inventarios" },
    { label: "Usuarios", icon: <FaUsers />, path: "/usuarios" },
    { label: "Proveedores", icon: <FaUsers />, path: "/proveedores" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col shadow-sm transition-all duration-300">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-9 h-9 bg-[#08988e] rounded-lg flex items-center justify-center text-white text-xl">
          <FaClinicMedical />
        </div>
        <span className="font-bold text-lg text-gray-900">FarmaGestión</span>
      </div>

      {/* Menú */}
      <nav className="flex-1 space-y-2">
        <div className="text-xs font-semibold text-gray-500 px-3 mb-3">
          PANEL PRINCIPAL
        </div>

        {menuItems.map((item) => (
          <div key={item.label}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-lg transition-colors
                ${
                  isActive
                    ? "bg-[#08988e] text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </div>
            </NavLink>
          </div>
        ))}

        {/* Ejemplo con submenú (puedes ampliar si quieres) */}
        <div className="mt-6">
          <button
            onClick={() => toggleExpand("reportes")}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FaChartLine className="text-lg" />
              <span className="font-medium">Módulos Avanzados</span>
            </div>
            {expanded.reportes ? <FaChevronDown /> : <FaChevronRight />}
          </button>

          {expanded.reportes && (
            <div className="ml-10 mt-2 space-y-2 text-sm">
              <NavLink
                to="/auditoria"
                className="block text-gray-600 hover:text-[#08988e]"
              >
                Auditoría
              </NavLink>
              <NavLink
                to="/comprobantes"
                className="block text-gray-600 hover:text-[#08988e]"
              >
                Comprobantes
              </NavLink>
              <NavLink
                to="/ubicaciones"
                className="block text-gray-600 hover:text-[#08988e]"
              >
                Ubicaciones
              </NavLink>
            </div>
          )}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 pt-4 mt-6 text-center">
        <p className="text-xs text-gray-500">© 2025 FarmaGestión</p>
      </div>
    </aside>
  );
};

export default Sidebar;

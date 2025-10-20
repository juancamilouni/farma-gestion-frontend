import React from "react";
import { FaHistory } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import {
  FaClinicMedical,
  FaHome,
  FaUserInjured,
  FaPills,
  FaFileMedical,
  FaChartLine,
  FaBoxes,
  FaUsers,
} from "react-icons/fa";

const Sidebar = () => {
  const menuItems = [
    { icon: <FaHome />, label: "Dashboard", path: "/dashboard" },
    { icon: <FaUserInjured />, label: "Pacientes", path: "/pacientes" },
    { icon: <FaPills />, label: "Items", path: "/items" },
    { icon: <FaFileMedical />, label: "Órdenes", path: "/ordenes" },
    { icon: <FaChartLine />, label: "Reportes", path: "/reportes" },
    { icon: <FaBoxes />, label: "Inventarios", path: "/inventarios" },
    { icon: <FaUsers />, label: "Usuarios", path: "/usuarios" },
    { icon: <FaUsers />, label: "Proveedores", path: "/proveedores" },
    { icon: <FaHome />, label: "Ubicaciones", path: "/ubicaciones" },
    { icon: <FaHistory />, label: "Auditoría", path: "/auditoria" },
    { icon: <FaFileMedical />, label: "Comprobantes", path: "/comprobantes" },
  ];

  return (
    <aside
      className="w-64 bg-[#08988e] flex flex-col p-6 h-screen shadow-lg"
      style={{ color: "#ffffff" }} // ✅ color blanco forzado para todo el sidebar
    >
      {/* Logo y nombre */}
      <h2
        className="text-2xl font-semibold mb-10 flex items-center gap-2"
        style={{ color: "#ffffff" }}
      >
        <FaClinicMedical className="text-2xl" style={{ color: "#ffffff" }} />
        <span>FarmaGestión</span>
      </h2>

      {/* Menú lateral */}
      <ul className="space-y-2 list-none m-0 p-0">
        {menuItems.map((item) => (
          <li key={item.label}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 
                ${isActive ? "bg-[#067d76]" : "hover:bg-[#078b83]"}`
              }
              style={{ color: "#ffffff" }} // ✅ texto blanco fijo
            >
              <span className="text-lg" style={{ color: "#ffffff" }}>
                {item.icon}
              </span>
              <span style={{ color: "#ffffff" }}>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Footer opcional */}

    </aside>
  );
};

export default Sidebar;

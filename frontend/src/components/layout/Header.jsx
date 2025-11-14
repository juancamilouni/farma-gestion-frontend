import React, { useEffect, useState, useRef } from "react";
import { FaBell, FaCog, FaSearch, FaBars } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const Header = ({ title, subtitle, onToggleSidebar }) => {
  const [user, setUser] = useState({
    name: "Usuario",
    role: "Sin rol asignado",
    initials: "U",
  });
  const [currentDate, setCurrentDate] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  // 🔹 Mapa de títulos dinámicos por ruta
  const routeTitles = {
    "/dashboard": "Dashboard / CMS",
    "/pacientes": "Pacientes / Gestión",
    "/items": "Medicamentos / Catálogo",
    "/ordenes": "Órdenes / Control",
    "/reportes": "Reportes / Análisis",
    "/inventarios": "Inventarios / Stock",
    "/usuarios": "Usuarios / Administración",
    "/proveedores": "Proveedores / Registro",
    "/auditoria": "Auditoría / Historial",
    "/comprobantes": "Comprobantes / Validación",
    "/ubicaciones": "Ubicaciones / Centros Médicos",
  };

  // 🔹 Título dinámico basado en la ruta
  const currentPath = location.pathname;
  const headerTitle =
    title || routeTitles[currentPath] || "FarmaGestión / CMS";

  useEffect(() => {
    // 🔸 Cargar usuario
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      const name = parsed.username || parsed.name || parsed.email || "Usuario";
      const role = parsed.role || "Usuario del sistema";

      const initials = name.includes("@")
        ? name
            .split("@")[0]
            .split(/[._-]/)
            .map((w) => w.charAt(0).toUpperCase())
            .join("")
            .slice(0, 2)
        : name.charAt(0).toUpperCase();

      setUser({ name, role, initials });
    }

    // 🔸 Fecha actual
    const now = new Date();
    setCurrentDate(
      now.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );

    // 🔸 Cerrar dropdown al hacer clic fuera
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <header className="flex justify-between items-center px-6 py-3 bg-white border-b border-gray-200 shadow-sm">
      {/* 🔹 Sección izquierda: título dinámico + fecha */}
      <div className="flex items-center gap-3">
        {/* Botón para colapsar sidebar (solo visible en móviles) */}
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="text-gray-600 hover:text-[#08988e] transition-colors lg:hidden"
          >
            <FaBars className="text-xl" />
          </button>
        )}
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            {headerTitle}
          </h2>
          <p className="text-sm text-gray-500">{subtitle || currentDate}</p>
        </div>
      </div>

      {/* 🔹 Sección derecha: acciones e información del usuario */}
      <div className="flex items-center gap-4 relative" ref={dropdownRef}>
        {/* Barra de búsqueda */}
        <div className="hidden md:flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Buscar..."
            className="bg-transparent outline-none text-sm text-gray-700 w-40"
          />
        </div>

        {/* Iconos de acción */}
        <button className="text-gray-600 hover:text-[#08988e] transition-colors">
          <FaBell className="text-lg" />
        </button>
        <button className="text-gray-600 hover:text-[#08988e] transition-colors">
          <FaCog className="text-lg" />
        </button>

        {/* Usuario */}
        <div
          className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <div className="w-10 h-10 rounded-full bg-[#08988e] text-white flex items-center justify-center text-sm font-semibold shadow-sm">
            {user.initials}
          </div>
          <div className="hidden sm:block text-left">
            <strong className="text-gray-800 text-sm">{user.name}</strong>
            <br />
            <small className="text-gray-500 text-xs">{user.role}</small>
          </div>
        </div>

        {/* Dropdown de usuario */}
        {showDropdown && (
          <div className="absolute top-14 right-0 bg-white rounded-xl shadow-lg border border-gray-200 py-2 w-56 z-50 animate-fade-in">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

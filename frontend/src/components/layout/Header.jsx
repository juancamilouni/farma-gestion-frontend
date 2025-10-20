import React, { useEffect, useState, useRef } from "react";

const Header = ({ title, subtitle }) => {
  const [user, setUser] = useState({
    name: "Usuario",
    role: "Sin rol asignado",
    initials: "U",
  });
  const [currentDate, setCurrentDate] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
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

    const now = new Date();
    setCurrentDate(
      now.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );

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
    <header className="flex justify-between items-center flex-wrap px-8 py-3 bg-gray-100 shadow-sm border-b border-gray-100">
      {/* 🕓 Fecha y título */}
      <div>
        <h3 className="text-gray-500 font-medium">{subtitle || currentDate}</h3>
        <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
      </div>

      {/* 👤 Usuario */}
      <div className="flex items-center gap-3 relative" ref={dropdownRef}>
        <div
          className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <div className="w-11 h-11 rounded-full bg-[#08988e] text-white flex items-center justify-center text-lg font-semibold shadow-sm">
            {user.initials}
          </div>
          <div className="hidden sm:block">
            <strong className="text-gray-800">{user.name}</strong>
            <br />
            <small className="text-gray-500 text-sm">{user.role}</small>
          </div>
        </div>

        {/* Dropdown */}
        {showDropdown && (
          <div className="absolute top-14 right-0 bg-white rounded-xl shadow-lg border border-gray-200 py-2 w-52 z-50 animate-fade-in">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
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

import React, { useState } from "react";
import { FaClinicMedical, FaUser, FaLock, FaSignInAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ captura de cambios en inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ simulamos login (aún sin backend)
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulamos “procesando login”
    setTimeout(() => {
      setLoading(false);

      // 👉 Guardamos un "usuario de prueba" en localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: formData.username || "Usuario Demo",
          role: "Administrador",
        })
      );

      // 🔁 Redirige al dashboard
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className="flex h-screen font-sans">
      {/* 🔹 Lado Izquierdo */}
      <div className="w-1/2 bg-[#08988e] flex flex-col justify-center items-center text-white p-10">
        <FaClinicMedical className="text-7xl mb-4" />
        <h1 className="text-4xl font-bold tracking-wide">FarmaGestión</h1>
        <p className="mt-3 text-lg text-center opacity-90">
          Sistema de Gestión Farmacéutica
        </p>
      </div>

      {/* 🔹 Lado Derecho */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-gray-50">
        <div className="w-4/5 max-w-md bg-white p-10 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-[#08988e] text-2xl font-semibold mb-6 flex items-center">
            <FaUser className="text-[#08988e] mr-3" /> Iniciar Sesión
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="relative mb-5">
              <FaUser className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text"
                name="username"
                placeholder="Usuario"
                value={formData.username}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-10 py-2 focus:outline-none focus:ring-2 focus:ring-[#08988e] transition"
              />
            </div>

            <div className="relative mb-5">
              <FaLock className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-10 py-2 focus:outline-none focus:ring-2 focus:ring-[#08988e] transition"
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#08988e] text-white px-5 py-2.5 rounded hover:bg-[#067a73] transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Procesando...
                  </>
                ) : (
                  <>
                    <FaSignInAlt /> Ingresar
                  </>
                )}
              </button>

              <Link
                to="/recuperar-contrasena"
                className="text-[#08988e] text-sm hover:underline ml-2"
              >
                ¿Olvidaste la Contraseña?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

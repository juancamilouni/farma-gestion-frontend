import React from "react";
import { FaClinicMedical, FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";

const RecuperarContrasena = () => {
  return (
    <div className="flex h-screen font-sans">
      {/* Lado Izquierdo */}
      <div className="w-1/2 bg-[#08988e] flex flex-col justify-center items-center text-white p-10">
        <FaClinicMedical className="text-7xl mb-4" />
        <h1 className="text-4xl font-bold tracking-wide">FarmaGestión</h1>
        <p className="mt-3 text-lg text-center opacity-90">
          Sistema de Gestión Farmacéutica
        </p>
      </div>

      {/* Lado Derecho */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-gray-50">
        <div className="w-4/5 max-w-md bg-white p-10 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-[#08988e] text-2xl font-semibold mb-6 flex items-center">
            <FaEnvelope className="text-[#08988e] mr-3" /> Recuperar Contraseña
          </h2>
          <p className="text-gray-600 mb-4">
            Ingresa tu correo y te enviaremos un enlace para restablecerla.
          </p>

          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full border border-gray-300 rounded px-4 py-2 mb-5 focus:outline-none focus:ring-2 focus:ring-[#08988e] transition"
          />

          <button className="w-full bg-[#08988e] text-white px-5 py-2.5 rounded hover:bg-[#067a73] transition">
            Enviar enlace
          </button>

          <Link
            to="/login"
            className="block text-center text-[#08988e] text-sm hover:underline mt-4"
          >
            ← Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecuperarContrasena;

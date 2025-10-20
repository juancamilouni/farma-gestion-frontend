import React, { useEffect, useState } from "react";
import api from "../config/api";

export default function Ubicaciones() {
  const [ubicaciones, setUbicaciones] = useState([]);

  useEffect(() => {
    api
      .get("/ubicaciones/")
      .then((data) => setUbicaciones(data))
      .catch((err) => console.error("Error al obtener ubicaciones:", err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#08988e] mb-4">
        Gestión de Ubicaciones
      </h1>

      {ubicaciones.length === 0 ? (
        <p>No hay ubicaciones registradas.</p>
      ) : (
        <table className="min-w-full bg-white border rounded shadow-sm">
          <thead className="bg-[#08988e] text-white">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-left">Descripción</th>
            </tr>
          </thead>
          <tbody>
            {ubicaciones.map((u) => (
              <tr key={u.id_ubicacion} className="border-b hover:bg-gray-100">
                <td className="px-4 py-2">{u.id_ubicacion}</td>
                <td className="px-4 py-2">{u.nombre}</td>
                <td className="px-4 py-2">{u.descripcion || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

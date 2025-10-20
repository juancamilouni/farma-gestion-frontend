import React, { useEffect, useState } from "react";
import api from "../config/api";

export default function Proveedores() {
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    api
      .get("/proveedores/")
      .then((data) => setProveedores(data))
      .catch((err) => console.error("Error al obtener proveedores:", err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#08988e] mb-4">Proveedores</h1>
      {proveedores.length === 0 ? (
        <p>No hay proveedores registrados.</p>
      ) : (
        <table className="min-w-full bg-white border rounded shadow-sm">
          <thead className="bg-[#08988e] text-white">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-left">NIT</th>
              <th className="px-4 py-2 text-left">Teléfono</th>
            </tr>
          </thead>
          <tbody>
            {proveedores.map((p) => (
              <tr key={p.id_proveedor} className="border-b hover:bg-gray-100">
                <td className="px-4 py-2">{p.id_proveedor}</td>
                <td className="px-4 py-2">{p.nombre}</td>
                <td className="px-4 py-2">{p.nit}</td>
                <td className="px-4 py-2">{p.telefono || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

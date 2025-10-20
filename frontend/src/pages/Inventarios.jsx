import React, { useEffect, useState } from "react";
import api from "../config/api";

export default function Inventarios() {
  const [existencias, setExistencias] = useState([]);

  useEffect(() => {
    api
      .get("/existencias/")
      .then((data) => setExistencias(data))
      .catch((err) => console.error("Error al obtener existencias:", err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#08988e] mb-4">
        Inventario General
      </h1>
      {existencias.length === 0 ? (
        <p>No hay existencias registradas.</p>
      ) : (
        <table className="min-w-full bg-white border rounded shadow-sm">
          <thead className="bg-[#08988e] text-white">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Item</th>
              <th className="px-4 py-2 text-left">Lote</th>
              <th className="px-4 py-2 text-left">Cantidad</th>
              <th className="px-4 py-2 text-left">Ubicación</th>
              <th className="px-4 py-2 text-left">Vencimiento</th>
            </tr>
          </thead>
          <tbody>
            {existencias.map((e) => (
              <tr key={e.id_existencia} className="border-b hover:bg-gray-100">
                <td className="px-4 py-2">{e.id_existencia}</td>
                <td className="px-4 py-2">{e.nombre_item}</td>
                <td className="px-4 py-2">{e.codigo_lote}</td>
                <td className="px-4 py-2">{e.cantidad}</td>
                <td className="px-4 py-2">{e.ubicacion}</td>
                <td className="px-4 py-2">{e.fecha_vencimiento}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

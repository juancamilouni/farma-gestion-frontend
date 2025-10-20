import React, { useEffect, useState } from "react";
import api from "../config/api";

export default function Auditoria() {
  const [registros, setRegistros] = useState([]);

  useEffect(() => {
    api
      .get("/auditoria/")
      .then((data) => setRegistros(data))
      .catch((err) => console.error("Error al obtener auditoría:", err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#08988e] mb-4">
        Historial de Auditoría
      </h1>

      {registros.length === 0 ? (
        <p>No hay registros de auditoría.</p>
      ) : (
        <table className="min-w-full bg-white border rounded shadow-sm">
          <thead className="bg-[#08988e] text-white">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Usuario</th>
              <th className="px-4 py-2 text-left">Acción</th>
              <th className="px-4 py-2 text-left">Tabla</th>
              <th className="px-4 py-2 text-left">ID Afectado</th>
              <th className="px-4 py-2 text-left">Fecha / Hora</th>
            </tr>
          </thead>
          <tbody>
            {registros.map((r) => (
              <tr key={r.id_evento} className="border-b hover:bg-gray-100">
                <td className="px-4 py-2">{r.id_evento}</td>
                <td className="px-4 py-2">{r.usuario}</td>
                <td className="px-4 py-2">{r.accion}</td>
                <td className="px-4 py-2">{r.tabla_afectada}</td>
                <td className="px-4 py-2">{r.id_registro}</td>
                <td className="px-4 py-2">
                  {new Date(r.fecha_hora).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

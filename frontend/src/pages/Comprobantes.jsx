import React, { useEffect, useState } from "react";
import api from "../config/api";

export default function Comprobantes() {
  const [comprobantes, setComprobantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Cargar comprobantes al montar el componente
  useEffect(() => {
    const fetchComprobantes = async () => {
      try {
        const data = await api.get("/comprobantes/");
        setComprobantes(data);
      } catch (err) {
        console.error("❌ Error al obtener comprobantes:", err);
        setError("Error al conectar con el servidor");
      } finally {
        setLoading(false);
      }
    };
    fetchComprobantes();
  }, []);

  if (loading) return <p className="p-6 text-gray-500">Cargando comprobantes...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#08988e] mb-6">
        Gestión de Comprobantes
      </h1>

      {comprobantes.length === 0 ? (
        <div className="text-gray-600">No hay comprobantes registrados.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-xl">
            <thead className="bg-[#08988e] text-white">
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Tipo</th>
                <th className="px-4 py-2 text-left">Fecha</th>
                <th className="px-4 py-2 text-left">Usuario</th>
                <th className="px-4 py-2 text-left">Estado</th>
                <th className="px-4 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {comprobantes.map((c) => (
                <tr
                  key={c.id_comprobante}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-2">{c.id_comprobante}</td>
                  <td className="px-4 py-2 capitalize">{c.tipo || "N/A"}</td>
                  <td className="px-4 py-2">
                    {new Date(c.fecha).toLocaleDateString("es-ES")}
                  </td>
                  <td className="px-4 py-2">{c.usuario || "—"}</td>
                  <td className="px-4 py-2">
                    {c.estado === "entregado" ? (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-semibold">
                        Entregado
                      </span>
                    ) : (
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-sm font-semibold">
                        Pendiente
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    {c.estado !== "entregado" && (
                      <button
                        onClick={() => marcarEntregado(c.id_comprobante)}
                        className="bg-[#08988e] hover:bg-[#05776f] text-white px-3 py-1 rounded-md text-sm"
                      >
                        Marcar Entregado
                      </button>
                    )}
                    <button
                      onClick={() => eliminarComprobante(c.id_comprobante)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // 🔹 Funciones auxiliares
  async function marcarEntregado(id) {
    if (!confirm("¿Marcar este comprobante como entregado?")) return;
    try {
      await api.put(`/comprobantes/entregar/${id}`);
      setComprobantes((prev) =>
        prev.map((c) =>
          c.id_comprobante === id ? { ...c, estado: "entregado" } : c
        )
      );
    } catch (err) {
      console.error("Error al marcar entregado:", err);
      alert("No se pudo marcar el comprobante como entregado.");
    }
  }

  async function eliminarComprobante(id) {
    if (!confirm("¿Seguro que deseas eliminar este comprobante?")) return;
    try {
      await api.delete(`/comprobantes/${id}`);
      setComprobantes((prev) => prev.filter((c) => c.id_comprobante !== id));
    } catch (err) {
      console.error("Error al eliminar comprobante:", err);
      alert("No se pudo eliminar el comprobante.");
    }
  }
}

import React, { useEffect, useState } from "react";
import api from "../config/api";

export default function Items() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api
      .get("/items/")
      .then((data) => setItems(data))
      .catch((err) => console.error("Error al obtener items:", err));
  }, []);

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-[#08988e] mb-4">Items</h1>
      <p className="text-gray-600 mb-6">
        Gestión de todos los ítems registrados en el sistema.
      </p>

      {items.length === 0 ? (
        <p className="text-gray-500 italic">No hay items registrados.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-sm">
            <thead className="bg-[#08988e] text-white">
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Nombre</th>
                <th className="px-4 py-2 text-left">Categoría</th>
                <th className="px-4 py-2 text-left">Stock</th>
              </tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <tr
                  key={i.id_item}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-2">{i.id_item}</td>
                  <td className="px-4 py-2">{i.nombre}</td>
                  <td className="px-4 py-2">{i.categoria || "—"}</td>
                  <td className="px-4 py-2">{i.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

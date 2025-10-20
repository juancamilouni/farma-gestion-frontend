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
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#08988e] mb-4">Items</h1>
      {items.length === 0 ? (
        <p>No hay items registrados.</p>
      ) : (
        <table className="min-w-full bg-white border rounded shadow-sm">
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
              <tr key={i.id_item} className="border-b hover:bg-gray-100">
                <td className="px-4 py-2">{i.id_item}</td>
                <td className="px-4 py-2">{i.nombre}</td>
                <td className="px-4 py-2">{i.categoria}</td>
                <td className="px-4 py-2">{i.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

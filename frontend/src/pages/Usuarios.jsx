import React, { useEffect, useState } from "react";
import api from "../config/api";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    api
      .get("/usuarios/") // 👈 ya sin /api
      .then((response) => setUsuarios(response))
      .catch((err) => console.error("Error:", err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#08988e] mb-4">Usuarios</h1>
      {usuarios.length === 0 ? (
        <p>No hay usuarios registrados.</p>
      ) : (
        <ul>
          {usuarios.map((u) => (
            <li key={u.id_usuario}>{u.nombre}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

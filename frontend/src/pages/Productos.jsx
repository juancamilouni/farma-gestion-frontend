import { useEffect, useState } from "react";


export default function Productos() {
  const [data, setData] = useState("Cargando...");

  useEffect(() => {
    // Cambia "/" por tu endpoint real, p.ej. "/items"
    apiGet("/")
      .then((d) => setData(JSON.stringify(d)))
      .catch(() => setData("Error al conectar con FastAPI ❌"));
  }, []);

  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-semibold">Productos</h2>
      <pre className="bg-white border rounded p-3">{data}</pre>
    </div>
  );
}

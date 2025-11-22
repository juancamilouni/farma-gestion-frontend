"use client";

import { useEffect, useState, useMemo } from "react";
import api from "../config/api";

export default function Lotes() {
  const [lotes, setLotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // FILTROS
  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("TODOS");


  // PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // MODAL CREAR
  const [showCreate, setShowCreate] = useState(false);
  const [newLote, setNewLote] = useState({
    nombre_item: "",
    unidad_medida: "",
    stock_minimo: 0,
    id_proveedor: "",
    codigo_lote: "",
    fecha_vencimiento: "",
    costo_unitario: 0,
    id_ubicacion_destino: "",
    cantidad: 0,
    id_usuario: 1,
    motivo: "Ingreso inicial de inventario"
  });

  // MODAL EDITAR
  const [showEdit, setShowEdit] = useState(false);
  const [editLote, setEditLote] = useState(null);

  // Cargar datos
  useEffect(() => {
    setLoading(true);
    api
      .get("/lotes")
      .then((res) => {
        setLotes(res || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando lotes:", err);
        setLoading(false);
      });
  }, []);

  // FILTRADO
  const filtered = useMemo(() => {
    return lotes.filter((l) => {
      const matchSearch =
        l.codigo_lote?.toLowerCase().includes(search.toLowerCase()) ||
        l.item_descripcion?.toLowerCase().includes(search.toLowerCase()) ||
        l.proveedor_nombre?.toLowerCase().includes(search.toLowerCase());

      const matchEstado =
        estadoFilter === "TODOS" || l.estado === estadoFilter;

      return matchSearch && matchEstado;
    });
  }, [lotes, search, estadoFilter]);

  // PAGINACIÓN
  const indexLast = currentPage * perPage;
  const indexFirst = indexLast - perPage;
  const currentData = filtered.slice(indexFirst, indexLast);
  const totalPages = Math.ceil(filtered.length / perPage);

  // Crear Lote
  const crearLote = async () => {
    try {
      const payload = {
        nombre_item: newLote.nombre_item,
        unidad_medida: newLote.unidad_medida,
        stock_minimo: Number(newLote.stock_minimo),
        id_proveedor: Number(newLote.id_proveedor),
        codigo_lote: newLote.codigo_lote,
        fecha_vencimiento: newLote.fecha_vencimiento,
        costo_unitario: Number(newLote.costo_unitario),
        id_ubicacion_destino: Number(newLote.id_ubicacion_destino),
        cantidad: Number(newLote.cantidad),
        id_usuario: 1,
        motivo: newLote.motivo
      };

      await api.post("/lotes", payload);
      setShowCreate(false);
      window.location.reload();
    } catch (e) {
      console.error("Error creando lote:", e);
      alert("Error creando lote. Revisa los campos.");
    }
  };

  // Editar lote
  const guardarEdicion = async () => {
    try {
      await api.put(`/lotes/${editLote.id_lote}`, {
        fecha_vencimiento: editLote.fecha_vencimiento,
        costo_unitario: Number(editLote.costo_unitario)
      });

      setShowEdit(false);
      window.location.reload();
    } catch (e) {
      console.error("Error actualizando lote:", e);
      alert("Error actualizando lote");
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#08988e] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando lotes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-xl shadow p-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-[#08988e]">Gestión de Lotes</h1>

          <button
            onClick={() => setShowCreate(true)}
            className="px-6 py-3 bg-[#08988e] text-white rounded-xl"
          >
            + Crear Lote
          </button>
        </div>

        {/* FILTROS */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Buscar por nombre, lote, proveedor..."
            className="border px-4 py-2 rounded-lg w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border px-4 py-2 rounded-lg"
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value)}
          >
            <option value="TODOS">Todos</option>
            <option value="ACTIVO">Activos</option>
            <option value="INACTIVO">Inactivos</option>
          </select>

          <select
            className="border px-4 py-2 rounded-lg"
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>

        {/* TABLA */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-xl">
            <thead className="bg-[#08988e] text-white">
              <tr>
                <th className="px-4 py-3">Lote</th>
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3">Proveedor</th>
                <th className="px-4 py-3">Vencimiento</th>
                <th className="px-4 py-3">Costo</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {currentData.map((l) => (
                <tr key={l.id_lote} className="hover:bg-gray-50 border-t">
                  <td className="px-4 py-2">{l.codigo_lote}</td>
                  <td className="px-4 py-2">{l.item_descripcion}</td>
                  <td className="px-4 py-2">{l.proveedor_nombre}</td>
                  <td className="px-4 py-2">{l.fecha_vencimiento}</td>
                  <td className="px-4 py-2">${l.costo_unitario}</td>
                  <td className="px-4 py-2">{l.estado}</td>

                  <td className="px-4 py-2">
                    <button
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
                      onClick={() => {
                        setEditLote(l);
                        setShowEdit(true);
                      }}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {/* PAGINACIÓN */}
        <div className="flex justify-between mt-6">
          <button
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-lg"
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            ← Anterior
          </button>

          <span>Página {currentPage} de {totalPages}</span>

          <button
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-lg"
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Siguiente →
          </button>
        </div>

      </div>

      {/* MODAL CREAR */}
      {showCreate && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg w-full max-w-xl">

            <h2 className="text-xl font-bold mb-4">Crear Lote</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <input
                type="text"
                className="border px-4 py-2 rounded-lg w-full"
                placeholder="Nombre del ítem"
                value={newLote.nombre_item}
                onChange={(e) =>
                  setNewLote({ ...newLote, nombre_item: e.target.value })
                }
              />

              <input
                type="text"
                className="border px-4 py-2 rounded-lg w-full"
                placeholder="Unidad de medida"
                value={newLote.unidad_medida}
                onChange={(e) =>
                  setNewLote({ ...newLote, unidad_medida: e.target.value })
                }
              />

              <input
                type="number"
                className="border px-4 py-2 rounded-lg w-full"
                placeholder="Stock mínimo"
                value={newLote.stock_minimo}
                onChange={(e) =>
                  setNewLote({ ...newLote, stock_minimo: e.target.value })
                }
              />

              <input
                type="number"
                className="border px-4 py-2 rounded-lg w-full"
                placeholder="ID Proveedor"
                value={newLote.id_proveedor}
                onChange={(e) =>
                  setNewLote({ ...newLote, id_proveedor: e.target.value })
                }
              />

              <input
                type="text"
                className="border px-4 py-2 rounded-lg w-full"
                placeholder="Código del lote"
                value={newLote.codigo_lote}
                onChange={(e) =>
                  setNewLote({ ...newLote, codigo_lote: e.target.value })
                }
              />

              <input
                type="date"
                className="border px-4 py-2 rounded-lg w-full"
                value={newLote.fecha_vencimiento}
                onChange={(e) =>
                  setNewLote({ ...newLote, fecha_vencimiento: e.target.value })
                }
              />

              <input
                type="number"
                className="border px-4 py-2 rounded-lg w-full"
                placeholder="Costo unitario"
                value={newLote.costo_unitario}
                onChange={(e) =>
                  setNewLote({ ...newLote, costo_unitario: e.target.value })
                }
              />

              <input
                type="number"
                className="border px-4 py-2 rounded-lg w-full"
                placeholder="ID ubicación destino"
                value={newLote.id_ubicacion_destino}
                onChange={(e) =>
                  setNewLote({
                    ...newLote,
                    id_ubicacion_destino: e.target.value
                  })
                }
              />

              <input
                type="number"
                className="border px-4 py-2 rounded-lg w-full"
                placeholder="Cantidad"
                value={newLote.cantidad}
                onChange={(e) =>
                  setNewLote({ ...newLote, cantidad: e.target.value })
                }
              />

            </div>

            <textarea
              className="border px-4 py-2 rounded-lg w-full mt-4"
              placeholder="Motivo del ingreso"
              value={newLote.motivo}
              onChange={(e) =>
                setNewLote({ ...newLote, motivo: e.target.value })
              }
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded-lg"
                onClick={() => setShowCreate(false)}
              >
                Cancelar
              </button>

              <button
                className="px-4 py-2 bg-[#08988e] text-white rounded-lg"
                onClick={crearLote}
              >
                Crear Lote
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL EDITAR */}
      {showEdit && editLote && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg w-full max-w-md">

            <h2 className="text-xl font-bold mb-4">Editar Lote</h2>

            <label className="block mb-3">Fecha de Vencimiento</label>
            <input
              type="date"
              className="border px-4 py-2 rounded-lg w-full mb-4"
              value={editLote.fecha_vencimiento}
              onChange={(e) =>
                setEditLote({ ...editLote, fecha_vencimiento: e.target.value })
              }
            />

            <label className="block mb-3">Costo Unitario</label>
            <input
              type="number"
              className="border px-4 py-2 rounded-lg w-full mb-4"
              value={editLote.costo_unitario}
              onChange={(e) =>
                setEditLote({ ...editLote, costo_unitario: e.target.value })
              }
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded-lg"
                onClick={() => setShowEdit(false)}
              >
                Cancelar
              </button>

              <button
                className="px-4 py-2 bg-[#08988e] text-white rounded-lg"
                onClick={guardarEdicion}
              >
                Guardar
              </button>
            </div>

          </div>
        </div>

      )}

    </div>
  );
}

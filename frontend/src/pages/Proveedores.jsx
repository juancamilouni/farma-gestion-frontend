"use client"

import { useEffect, useState } from "react"
import api from "../config/api"

export default function Proveedores() {
  const [proveedores, setProveedores] = useState([])
  const [filtrados, setFiltrados] = useState([])
  const [busqueda, setBusqueda] = useState("")
  const [mostrarModal, setMostrarModal] = useState(false)
  const [cargando, setCargando] = useState(true)
  const [editando, setEditando] = useState(null)
  const [error, setError] = useState("")
  const [nuevoProveedor, setNuevoProveedor] = useState({
    nombre: "",
    nit: "",
    telefono: "",
  })

  useEffect(() => {
    cargarProveedores()
  }, [])

  const cargarProveedores = async () => {
    setCargando(true)
    setError("")
    try {
      const data = await api.get("/proveedores/")
      setProveedores(data)
      setFiltrados(data)
    } catch (err) {
      setError("Error al cargar proveedores")
      console.error("[v0] Error al obtener proveedores:", err)
    } finally {
      setCargando(false)
    }
  }

  const manejarBusqueda = (valor) => {
    setBusqueda(valor)
    const resultado = proveedores.filter(
      (p) => p.nombre.toLowerCase().includes(valor.toLowerCase()) || p.nit.includes(valor),
    )
    setFiltrados(resultado)
  }

  const abrirModal = (proveedor = null) => {
    if (proveedor) {
      setEditando(proveedor.id_proveedor)
      setNuevoProveedor({
        nombre: proveedor.nombre,
        nit: proveedor.nit,
        telefono: proveedor.telefono || "",
      })
    } else {
      setEditando(null)
      setNuevoProveedor({ nombre: "", nit: "", telefono: "" })
    }
    setMostrarModal(true)
    setError("")
  }

  const guardarProveedor = async () => {
    if (!nuevoProveedor.nombre || !nuevoProveedor.nit) {
      setError("Por favor completa todos los campos requeridos")
      return
    }

    try {
      if (editando) {
        await api.put(`/proveedores/${editando}`, nuevoProveedor)
        setMostrarModal(false)
        cargarProveedores()
      } else {
        await api.post("/proveedores/", nuevoProveedor)
        setMostrarModal(false)
        cargarProveedores()
      }
    } catch (err) {
      setError("Error al guardar proveedor")
      console.error("[v0] Error al guardar proveedor:", err)
    }
  }

  const eliminarProveedor = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este proveedor?")) {
      try {
        await api.delete(`/proveedores/${id}`)
        cargarProveedores()
      } catch (err) {
        setError("Error al eliminar proveedor")
        console.error("[v0] Error al eliminar proveedor:", err)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-1">
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-10">
        {/* TITULO Y DESCRIPCION */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-teal-100 rounded-full p-2">
              <svg className="w-6 h-6 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v2h8v-2zM2 8a2 2 0 11-4 0 2 2 0 014 0zM8 15a4 4 0 00-8 0v2h8v-2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Proveedores</h1>
          </div>
          <p className="text-gray-600 ml-11">Gestiona y organiza tus proveedores con facilidad</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-pulse">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 001.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-teal-50 rounded-xl p-6 border border-teal-100 shadow-sm hover:shadow-md transition duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-teal-700 bg-teal-100 px-3 py-1 rounded-full">Total</span>
              <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM12.13 16H7m22-2a4 4 0 01-8 0m0 0a4 4 0 11-8 0"
                />
              </svg>
            </div>
            <p className="text-2xl font-bold text-teal-900">{proveedores.length}</p>
            <p className="text-xs text-teal-600 mt-2">proveedores registrados</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 rounded-xl p-6 border border-blue-100 shadow-sm hover:shadow-md transition duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-blue-700 bg-blue-100 px-3 py-1 rounded-full">Activos</span>
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-2xl font-bold text-blue-900">{filtrados.length}</p>
            <p className="text-xs text-blue-600 mt-2">en búsqueda actual</p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 rounded-xl p-6 border border-amber-100 shadow-sm hover:shadow-md transition duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                Actualizado
              </span>
              <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-2xl font-bold text-amber-900">Hoy</p>
            <p className="text-xs text-amber-600 mt-2">información al día</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-50 to-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-end justify-between">
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Buscar proveedor</label>
              <div className="relative">
                <svg
                  className="absolute left-4 top-3 w-5 h-5 text-gray-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Busca por nombre o NIT..."
                  value={busqueda}
                  onChange={(e) => manejarBusqueda(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                />
              </div>
            </div>
            <button
              onClick={() => abrirModal()}
              className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-6 py-3 rounded-lg font-semibold transition duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Agregar Proveedor
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {cargando ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin">
                <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              <p className="text-gray-600 mt-4 font-medium">Cargando proveedores...</p>
            </div>
          ) : filtrados.length === 0 ? (
            <div className="p-12 text-center">
              <svg
                className="w-16 h-16 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <p className="text-gray-600 font-semibold text-lg">No hay proveedores registrados</p>
              <p className="text-gray-500 text-sm mt-2">
                {busqueda ? "Intenta con otros términos de búsqueda" : "Comienza agregando tu primer proveedor"}
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-teal-600 to-teal-700 text-white">
                  <th className="px-6 py-4 text-left text-sm font-bold">Nombre</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">NIT</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Teléfono</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((p) => (
                  <tr
                    key={p.id_proveedor}
                    className="border-b border-gray-100 hover:bg-teal-50 transition duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-teal-100 rounded-full p-2.5">
                          <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v2h8v-2zM2 8a2 2 0 11-4 0 2 2 0 014 0zM8 15a4 4 0 00-8 0v2h8v-2z" />
                          </svg>
                        </div>
                        <span className="font-semibold text-gray-900">{p.nombre}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-700 font-medium">{p.nit}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600">{p.telefono || "—"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => abrirModal(p)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition duration-200"
                          title="Editar"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-7.5-1l1.5-1.5m0 0l7-7a2 2 0 012.828 0 2 2 0 010 2.828l-7 7"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => eliminarProveedor(p.id_proveedor)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition duration-200"
                          title="Eliminar"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {mostrarModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editando ? "Editar Proveedor" : "Nuevo Proveedor"}
                </h2>
                <button onClick={() => setMostrarModal(false)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre del Proveedor *</label>
                  <input
                    type="text"
                    value={nuevoProveedor.nombre}
                    onChange={(e) => setNuevoProveedor({ ...nuevoProveedor, nombre: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                    placeholder="Ej: Distribuidora ABC"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">NIT *</label>
                  <input
                    type="text"
                    value={nuevoProveedor.nit}
                    onChange={(e) => setNuevoProveedor({ ...nuevoProveedor, nit: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                    placeholder="Ej: 123456789"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Teléfono</label>
                  <input
                    type="tel"
                    value={nuevoProveedor.telefono}
                    onChange={(e) => setNuevoProveedor({ ...nuevoProveedor, telefono: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                    placeholder="Ej: +57 310 1234567"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setMostrarModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={guardarProveedor}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg hover:from-teal-700 hover:to-teal-800 font-semibold transition duration-200 shadow-md"
                >
                  {editando ? "Actualizar" : "Agregar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

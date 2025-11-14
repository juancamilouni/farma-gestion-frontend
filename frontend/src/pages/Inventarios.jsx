"use client"

import { useEffect, useState, useMemo } from "react"
import api from "../config/api"

export default function Inventarios() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("nombre")
  const [filterTipo, setFilterTipo] = useState("todos")

  const [showModal, setShowModal] = useState(false)
  const [newItem, setNewItem] = useState({
    id_ubicacion: "",
    codigo: "",
    descripcion: "",
    tipo_item: "MEDICAMENTO",
    unidad_medida: "UND",
    stock_minimo: 0,
  })

  const openModal = () => setShowModal(true)
  const closeModal = () => setShowModal(false)

  const handleChange = (e) => {
    setNewItem({
      ...newItem,
      [e.target.name]: e.target.value,
    })
  }

  const submitNewItem = async () => {
    try {
      await api.post("/items/", newItem)
      closeModal()
      window.location.reload()
    } catch (err) {
      console.error("Error creando item:", err)
    }
  }

  useEffect(() => {
    setLoading(true)
    api
      .get("/items/")
      .then((data) => {
        setItems(data || [])
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error al obtener items:", err)
        setLoading(false)
      })
  }, [])

  const filteredData = useMemo(() => {
    const result = items.filter((item) => {
      const matchesSearch =
        item.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.codigo?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesTipo = filterTipo === "todos" || item.tipo_item === filterTipo

      return matchesSearch && matchesTipo
    })

    result.sort((a, b) => {
      switch (sortBy) {
        case "nombre":
          return a.descripcion.localeCompare(b.descripcion)
        case "codigo":
          return a.codigo.localeCompare(b.codigo)
        default:
          return 0
      }
    })

    return result
  }, [items, searchTerm, sortBy, filterTipo])

  const totalItems = items.length
  const totalStockMinimo = items.reduce((sum, item) => sum + (item.stock_minimo || 0), 0)

  const getTypeIcon = (tipo) => {
    const icons = {
      MEDICAMENTO: "💊",
      INSUMO: "📦",
      EQUIPO: "🏥",
    }
    return icons[tipo] || "📋"
  }

  const getTypeBadge = (tipo) => {
    const styles = {
      MEDICAMENTO: "bg-blue-100 text-blue-800",
      INSUMO: "bg-purple-100 text-purple-800",
      EQUIPO: "bg-green-100 text-green-800",
    }
    return styles[tipo] || "bg-gray-100 text-gray-800"
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#08988e] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando inventario...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-1">
      {/* CONTENEDOR BLANCO - MANTENER IGUAL */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-10">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Gestión de Inventarios</h1>
            <p className="text-gray-600 mt-2 text-lg">
              Administra productos, medicamentos y suministros de forma centralizada.
            </p>
          </div>

          <button
            onClick={openModal}
            className="bg-[#08988e] hover:bg-[#067a6f] text-white px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 font-semibold flex items-center gap-2 whitespace-nowrap"
          >
            <span className="text-xl">+</span> Añadir Lote
          </button>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Crear Nuevo Lote</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <input
                  name="codigo"
                  placeholder="Código del lote"
                  value={newItem.codigo}
                  className="col-span-1 md:col-span-1 border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#08988e] focus:border-transparent outline-none transition"
                  onChange={handleChange}
                />

                <input
                  name="descripcion"
                  placeholder="Descripción del producto"
                  value={newItem.descripcion}
                  className="col-span-1 md:col-span-1 border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#08988e] focus:border-transparent outline-none transition"
                  onChange={handleChange}
                />

                <select
                  name="tipo_item"
                  value={newItem.tipo_item}
                  onChange={handleChange}
                  className="border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#08988e] focus:border-transparent outline-none transition"
                >
                  <option value="MEDICAMENTO">Medicamento</option>
                  <option value="INSUMO">Insumo</option>
                  <option value="EQUIPO">Equipo</option>
                </select>

                <input
                  name="id_ubicacion"
                  placeholder="ID Ubicación"
                  value={newItem.id_ubicacion}
                  className="border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#08988e] focus:border-transparent outline-none transition"
                  onChange={handleChange}
                />

                <input
                  name="unidad_medida"
                  placeholder="Unidad de Medida"
                  value={newItem.unidad_medida}
                  className="border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#08988e] focus:border-transparent outline-none transition"
                  onChange={handleChange}
                />

                <input
                  type="number"
                  name="stock_minimo"
                  placeholder="Stock Mínimo"
                  value={newItem.stock_minimo}
                  className="border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#08988e] focus:border-transparent outline-none transition"
                  onChange={handleChange}
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-semibold"
                >
                  Cancelar
                </button>

                <button
                  onClick={submitNewItem}
                  className="px-6 py-3 bg-[#08988e] text-white rounded-lg hover:bg-[#067a6f] transition font-semibold"
                >
                  Guardar Lote
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 hover:shadow-md transition-shadow">
            <p className="text-blue-600 text-sm font-semibold uppercase tracking-wide">Total de Lotes</p>
            <p className="text-4xl font-bold text-blue-800 mt-3">{totalItems}</p>
            <p className="text-blue-600 text-xs mt-2">Productos en sistema</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 hover:shadow-md transition-shadow">
            <p className="text-green-600 text-sm font-semibold uppercase tracking-wide">Stock Mínimo Total</p>
            <p className="text-4xl font-bold text-green-800 mt-3">{totalStockMinimo}</p>
            <p className="text-green-600 text-xs mt-2">Unidades requeridas</p>
          </div>

          <div className="bg-gradient-to-br from-[#08988e] to-[#067a6f] p-6 rounded-xl border border-[#067a6f] hover:shadow-md transition-shadow">
            <p className="text-white text-sm font-semibold uppercase tracking-wide">Estado Sistema</p>
            <p className="text-4xl font-bold text-white mt-3">✓</p>
            <p className="text-gray-100 text-xs mt-2">Activo y operativo</p>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-6">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Filtros y Búsqueda</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Buscar por nombre o código</label>
              <input
                type="text"
                placeholder="Escribir aquí..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#08988e] focus:border-transparent outline-none transition"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Producto</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#08988e] focus:border-transparent outline-none transition"
                onChange={(e) => setFilterTipo(e.target.value)}
              >
                <option value="todos">Todos los tipos</option>
                <option value="MEDICAMENTO">Medicamentos</option>
                <option value="INSUMO">Insumos</option>
                <option value="EQUIPO">Equipos</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#08988e] focus:border-transparent outline-none transition"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="nombre">Nombre</option>
                <option value="codigo">Código</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[#08988e] to-[#067a6f] text-white">
                  <th className="px-6 py-4 text-left text-sm font-semibold">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Código</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Descripción</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Tipo</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">U. Medida</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Stock Mínimo</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Ubicación</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {filteredData.map((item, index) => (
                  <tr
                    key={item.id_item}
                    className="hover:bg-gray-50 transition-colors duration-200"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">#{item.id_item}</td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600 bg-gray-50">{item.codigo}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{item.descripcion}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`${getTypeBadge(item.tipo_item)} px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 w-fit`}
                      >
                        {getTypeIcon(item.tipo_item)} {item.tipo_item}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.unidad_medida}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg font-semibold">
                        {item.stock_minimo}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.id_ubicacion || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredData.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-gray-500 text-lg">No se encontraron lotes que coincidan con los filtros.</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-between items-center text-sm text-gray-600">
          <p>
            Mostrando <span className="font-semibold text-gray-900">{filteredData.length}</span> de{" "}
            <span className="font-semibold text-gray-900">{items.length}</span> lotes
          </p>
          <p className="text-xs text-gray-500">Última actualización: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  )
}

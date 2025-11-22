"use client"

import { useEffect, useState, useMemo } from "react"
import api from "../config/api"

export default function Inventarios() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // FILTROS / BUSCADOR
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroTipo, setFiltroTipo] = useState("TODOS")          // MEDICAMENTO / INSUMO / EQUIPO / TODOS
  const [filtroUbicacion, setFiltroUbicacion] = useState("TODAS")

  // ORDENAMIENTO
  const [sortConfig, setSortConfig] = useState({
    key: "descripcion",
    direction: "asc",
  })

  // PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // MODAL CREAR ITEM
  const [showModal, setShowModal] = useState(false)
  const [newItem, setNewItem] = useState({
    id_ubicacion: "",
    codigo: "",
    descripcion: "",
    tipo_item: "MEDICAMENTO",
    unidad_medida: "UND",
    stock_minimo: 0,
  })

  // MODAL EDITAR ITEM
  const [showEditModal, setShowEditModal] = useState(false)
  const [editItem, setEditItem] = useState(null)

  // -----------------------------------
  // API – CARGA DE ITEMS
  // -----------------------------------
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await api.get("/items/")
        setItems(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error("Error al obtener items:", err)
        setError("No se pudieron cargar los items.")
        setItems([])
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [])

  // -----------------------------------
  // HANDLERS MODALES
  // -----------------------------------
  const openModal = () => setShowModal(true)
  const closeModal = () => setShowModal(false)

  const openEditModal = (item) => {
    setEditItem({ ...item })
    setShowEditModal(true)
  }

  const closeEditModal = () => {
    setEditItem(null)
    setShowEditModal(false)
  }

  // -----------------------------------
  // FORMULARIOS
  // -----------------------------------
  const handleChange = (e) => {
    setNewItem({
      ...newItem,
      [e.target.name]: e.target.value,
    })
  }

  const handleEditChange = (e) => {
    setEditItem({
      ...editItem,
      [e.target.name]: e.target.value,
    })
  }

  // CREAR ITEM
  const submitNewItem = async () => {
    try {
      await api.post("/items/", newItem)
      closeModal()
      window.location.reload()
    } catch (err) {
      console.error("Error creando item:", err)
      alert("Error creando item")
    }
  }

  // ACTUALIZAR ITEM COMPLETO (PUT /items/update-full/{id})
  const submitUpdateItem = async () => {
    try {
      await api.put(`/items/update-full/${editItem.id_item}`, {
        id_ubicacion: Number(editItem.id_ubicacion),
        codigo: editItem.codigo,
        descripcion: editItem.descripcion,
        tipo_item: editItem.tipo_item,
        unidad_medida: editItem.unidad_medida,
        stock_minimo: Number(editItem.stock_minimo),
      })

      closeEditModal()
      window.location.reload()
    } catch (error) {
      console.error("Error actualizando item:", error)
      alert("Error actualizando item")
    }
  }

  // -----------------------------------
  // OPCIONES DE FILTROS (tipo / ubicación)
  // -----------------------------------
  const opcionesTipo = useMemo(() => {
    const tipos = [...new Set(items.map((i) => i.tipo_item).filter(Boolean))]
    return tipos.sort()
  }, [items])

  const opcionesUbicacion = useMemo(() => {
    const ubicaciones = [...new Set(items.map((i) => i.id_ubicacion).filter(Boolean))]
    return ubicaciones.sort((a, b) => Number(a) - Number(b))
  }, [items])

  // -----------------------------------
  // FILTRADO + ORDEN + PAGINACIÓN
  // -----------------------------------
  const filteredData = useMemo(() => {
    let result = [...items]

    // BÚSQUEDA
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      result = result.filter((item) => {
        return (
          item.descripcion?.toLowerCase().includes(searchLower) ||
          item.codigo?.toLowerCase().includes(searchLower) ||
          item.id_item?.toString().includes(searchLower)
        )
      })
    }

    // FILTRO TIPO
    if (filtroTipo !== "TODOS") {
      result = result.filter((item) => item.tipo_item === filtroTipo)
    }

    // FILTRO UBICACIÓN
    if (filtroUbicacion !== "TODAS") {
      result = result.filter(
        (item) => String(item.id_ubicacion) === String(filtroUbicacion),
      )
    }

    // ORDENAMIENTO
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key]
        let bValue = b[sortConfig.key]

        if (aValue === undefined || aValue === null) aValue = ""
        if (bValue === undefined || bValue === null) bValue = ""

        if (typeof aValue === "string") aValue = aValue.toLowerCase()
        if (typeof bValue === "string") bValue = bValue.toLowerCase()

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
        return 0
      })
    }

    return result
  }, [items, searchTerm, filtroTipo, filtroUbicacion, sortConfig])

  const totalItemsFiltrados = filteredData.length
  const totalPages = Math.ceil(totalItemsFiltrados / itemsPerPage) || 1

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = filteredData.slice(startIndex, endIndex)

  // Cuando cambia búsqueda o filtros → volver a página 1
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filtroTipo, filtroUbicacion, itemsPerPage])

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        }
      }
      return {
        key,
        direction: "asc",
      }
    })
  }

  const limpiarFiltros = () => {
    setSearchTerm("")
    setFiltroTipo("TODOS")
    setFiltroUbicacion("TODAS")
    setSortConfig({ key: "descripcion", direction: "asc" })
  }

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages)
      }
    }
    return pages
  }

  // -----------------------------------
  // ICONOS
  // -----------------------------------
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

  // -----------------------------------
  // ESTADOS DE CARGA / ERROR
  // -----------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#08988e] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Cargando inventario...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-md border border-red-200 p-8 max-w-md">
          <div className="text-center">
            <svg
              className="w-16 h-16 mx-auto text-red-500 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Error de conexión</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#08988e] text-white rounded-lg hover:bg-[#067268] transition"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    )
  }

  // -----------------------------------
  // RENDER PRINCIPAL
  // -----------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-1">
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-10">
        {/* HEADER */}
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

        {/* BARRA DE BÚSQUEDA + FILTROS (estilo Auditoría) */}
        <div className="mb-6 space-y-4">
          {/* BUSCADOR */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por código, descripción o ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#08988e] bg-white"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
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
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* FILTROS */}
          <div className="flex flex-wrap gap-3">
            {/* FILTRO TIPO */}
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#08988e] bg-white text-sm"
            >
              <option value="TODOS">Todos los tipos</option>
              {opcionesTipo.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>

            {/* FILTRO UBICACIÓN */}
            <select
              value={filtroUbicacion}
              onChange={(e) => setFiltroUbicacion(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#08988e] bg-white text-sm"
            >
              <option value="TODAS">Todas las ubicaciones</option>
              {opcionesUbicacion.map((ubi) => (
                <option key={ubi} value={ubi}>
                  {ubi}
                </option>
              ))}
            </select>

            {/* LIMPIAR FILTROS */}
            {(searchTerm || filtroTipo !== "TODOS" || filtroUbicacion !== "TODAS") && (
              <button
                onClick={limpiarFiltros}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm flex items-center gap-1"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Limpiar filtros
              </button>
            )}
          </div>
        </div>

        {/* INFO + ITEMS POR PÁGINA */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div className="text-sm text-gray-600">
            Mostrando{" "}
            <span className="font-semibold text-[#08988e]">
              {totalItemsFiltrados === 0 ? 0 : startIndex + 1}
            </span>{" "}
            a{" "}
            <span className="font-semibold text-[#08988e]">
              {Math.min(endIndex, totalItemsFiltrados)}
            </span>{" "}
            de{" "}
            <span className="font-semibold text-[#08988e]">
              {totalItemsFiltrados}
            </span>{" "}
            lotes
            {totalItemsFiltrados !== items.length && (
              <span className="text-gray-500">
                {" "}
                (filtrado de {items.length} total)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="itemsPerPage" className="text-sm text-gray-600">
              Mostrar:
            </label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#08988e] bg-white"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-gray-600">por página</span>
          </div>
        </div>

        {/* TABLA */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            {totalItemsFiltrados === 0 ? (
              <div className="p-8 text-center">
                <svg
                  className="w-16 h-16 mx-auto text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-gray-600 text-lg">
                  {items.length === 0
                    ? "No hay lotes registrados."
                    : "No se encontraron lotes con los filtros aplicados."}
                </p>
                {items.length > 0 && (
                  <button
                    onClick={limpiarFiltros}
                    className="mt-4 px-4 py-2 bg-[#08988e] text-white rounded-lg hover:bg-[#067268] transition"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-[#08988e] to-[#067a6f] text-white text-sm uppercase">
                    <th
                      className="px-6 py-4 text-left cursor-pointer hover:bg-[#067268] transition"
                      onClick={() => handleSort("id_item")}
                    >
                      <div className="flex items-center gap-2">
                        ID
                        {sortConfig.key === "id_item" && (
                          <svg
                            className={`w-4 h-4 transition-transform ${
                              sortConfig.direction === "desc"
                                ? "rotate-180"
                                : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                        )}
                      </div>
                    </th>

                    <th
                      className="px-6 py-4 text-left cursor-pointer hover:bg-[#067268] transition"
                      onClick={() => handleSort("codigo")}
                    >
                      <div className="flex items-center gap-2">
                        Código
                        {sortConfig.key === "codigo" && (
                          <svg
                            className={`w-4 h-4 transition-transform ${
                              sortConfig.direction === "desc"
                                ? "rotate-180"
                                : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                        )}
                      </div>
                    </th>

                    <th
                      className="px-6 py-4 text-left cursor-pointer hover:bg-[#067268] transition"
                      onClick={() => handleSort("descripcion")}
                    >
                      <div className="flex items-center gap-2">
                        Descripción
                        {sortConfig.key === "descripcion" && (
                          <svg
                            className={`w-4 h-4 transition-transform ${
                              sortConfig.direction === "desc"
                                ? "rotate-180"
                                : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                        )}
                      </div>
                    </th>

                    <th className="px-6 py-4 text-left">Tipo</th>
                    <th className="px-6 py-4 text-left">U. Medida</th>
                    <th className="px-6 py-4 text-left">Stock Mínimo</th>
                    <th className="px-6 py-4 text-left">Ubicación</th>
                    <th className="px-6 py-4 text-center">Acciones</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 text-sm">
                  {currentItems.map((item, idx) => (
                    <tr
                      key={item.id_item}
                      className={`hover:bg-gray-50 transition ${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"
                      }`}
                    >
                      <td className="px-6 py-4 font-medium text-gray-700">
                        #{item.id_item}
                      </td>
                      <td className="px-6 py-4 font-mono bg-gray-50">
                        {item.codigo}
                      </td>
                      <td className="px-6 py-4">{item.descripcion}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`${getTypeBadge(
                            item.tipo_item,
                          )} px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit`}
                        >
                          {getTypeIcon(item.tipo_item)} {item.tipo_item}
                        </span>
                      </td>
                      <td className="px-6 py-4">{item.unidad_medida}</td>
                      <td className="px-6 py-4">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg font-semibold">
                          {item.stock_minimo}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {item.id_ubicacion ?? "Sin ubicación"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => openEditModal(item)}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-xs font-medium"
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* PAGINACIÓN ESTILO AUDITORÍA */}
        {totalItemsFiltrados > 0 && totalPages > 1 && (
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              Página{" "}
              <span className="font-semibold text-[#08988e]">
                {currentPage}
              </span>{" "}
              de{" "}
              <span className="font-semibold text-[#08988e]">
                {totalPages}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-[#08988e] hover:text-white hover:border-[#08988e]"
                }`}
                title="Primera página"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-[#08988e] hover:text-white hover:border-[#08988e]"
                }`}
              >
                Anterior
              </button>

              <div className="hidden sm:flex items-center gap-1">
                {getPageNumbers().map((page, idx) =>
                  page === "..." ? (
                    <span
                      key={`ellipsis-${idx}`}
                      className="px-3 py-2 text-gray-500"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                        currentPage === page
                          ? "bg-[#08988e] text-white"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-[#08988e] hover:text-white hover:border-[#08988e]"
                }`}
              >
                Siguiente
              </button>

              <button
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-[#08988e] hover:text-white hover:border-[#08988e]"
                }`}
                title="Última página"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 5l7 7-7 7M5 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* MODAL CREAR ITEM */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">
                Crear Nuevo Lote
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <input
                  name="codigo"
                  value={newItem.codigo}
                  placeholder="Código"
                  className="border px-4 py-3 rounded-lg"
                  onChange={handleChange}
                />
                <input
                  name="descripcion"
                  value={newItem.descripcion}
                  placeholder="Descripción"
                  className="border px-4 py-3 rounded-lg"
                  onChange={handleChange}
                />
                <select
                  name="tipo_item"
                  value={newItem.tipo_item}
                  className="border px-4 py-3 rounded-lg"
                  onChange={handleChange}
                >
                  <option value="MEDICAMENTO">Medicamento</option>
                  <option value="INSUMO">Insumo</option>
                  <option value="EQUIPO">Equipo</option>
                </select>
                <input
                  name="id_ubicacion"
                  value={newItem.id_ubicacion}
                  placeholder="Ubicación"
                  className="border px-4 py-3 rounded-lg"
                  onChange={handleChange}
                />
                <input
                  name="unidad_medida"
                  value={newItem.unidad_medida}
                  placeholder="Unidad"
                  className="border px-4 py-3 rounded-lg"
                  onChange={handleChange}
                />
                <input
                  type="number"
                  name="stock_minimo"
                  value={newItem.stock_minimo}
                  placeholder="Stock mínimo"
                  className="border px-4 py-3 rounded-lg"
                  onChange={handleChange}
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="px-6 py-3 bg-gray-200 rounded-lg"
                >
                  Cancelar
                </button>

                <button
                  onClick={submitNewItem}
                  className="px-6 py-3 bg-[#08988e] text-white rounded-lg hover:bg-[#067a6f]"
                >
                  Guardar Lote
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL EDITAR ITEM */}
        {showEditModal && editItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-xl">
              <h2 className="text-2xl font-bold mb-6">Editar Lote</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input
                  name="codigo"
                  value={editItem.codigo}
                  onChange={handleEditChange}
                  placeholder="Código"
                  className="border px-4 py-3 rounded-lg"
                />

                <input
                  name="descripcion"
                  value={editItem.descripcion}
                  onChange={handleEditChange}
                  placeholder="Descripción"
                  className="border px-4 py-3 rounded-lg"
                />

                <select
                  name="tipo_item"
                  value={editItem.tipo_item}
                  onChange={handleEditChange}
                  className="border px-4 py-3 rounded-lg"
                >
                  <option value="MEDICAMENTO">Medicamento</option>
                  <option value="INSUMO">Insumo</option>
                  <option value="EQUIPO">Equipo</option>
                </select>

                <input
                  name="id_ubicacion"
                  value={editItem.id_ubicacion}
                  onChange={handleEditChange}
                  placeholder="Ubicación"
                  className="border px-4 py-3 rounded-lg"
                />

                <input
                  name="unidad_medida"
                  value={editItem.unidad_medida}
                  onChange={handleEditChange}
                  placeholder="Unidad"
                  className="border px-4 py-3 rounded-lg"
                />

                <input
                  type="number"
                  name="stock_minimo"
                  value={editItem.stock_minimo}
                  onChange={handleEditChange}
                  placeholder="Stock mínimo"
                  className="border px-4 py-3 rounded-lg"
                />
              </div>

              <div className="flex justify-end mt-6 gap-3">
                <button
                  onClick={closeEditModal}
                  className="px-6 py-3 bg-gray-200 rounded-lg"
                >
                  Cancelar
                </button>

                <button
                  onClick={submitUpdateItem}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

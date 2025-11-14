import React, { useEffect, useState, useMemo } from "react";
import api from "../config/api";

export default function Auditoria() {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroAccion, setFiltroAccion] = useState("TODAS");
  const [filtroTabla, setFiltroTabla] = useState("TODAS");
  const [filtroUsuario, setFiltroUsuario] = useState("TODOS");
  const [sortConfig, setSortConfig] = useState({ key: 'id_evento', direction: 'desc' });
  
  const [selectedRegistro, setSelectedRegistro] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await api.get("/auditoria/");
        console.log("[v0] Datos recibidos del backend:", data);
        setRegistros(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("[v0] Error al obtener datos:", err);
        setError(err.message);
        setRegistros([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getColorAccion = (accion) => {
    const estilos = {
      CREATE: "bg-emerald-100 text-emerald-700 border border-emerald-300",
      UPDATE: "bg-blue-100 text-blue-700 border border-blue-300",
      DELETE: "bg-red-100 text-red-700 border border-red-300",
      READ: "bg-gray-100 text-gray-700 border border-gray-300",
    };
    return estilos[accion] || "bg-gray-100 text-gray-700 border";
  };

  const getIconoAccion = (accion) => {
    const iconos = {
      CREATE: "✚",
      UPDATE: "⟳",
      DELETE: "✕",
      READ: "👁",
    };
    return iconos[accion] || "•";
  };

  const registrosFiltrados = useMemo(() => {
    let filtered = [...registros];

    if (searchTerm) {
      filtered = filtered.filter((r) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          r.id_evento?.toString().includes(searchLower) ||
          r.usuario?.toLowerCase().includes(searchLower) ||
          r.accion?.toLowerCase().includes(searchLower) ||
          r.tabla_afectada?.toLowerCase().includes(searchLower) ||
          r.id_registro?.toString().includes(searchLower) ||
          r.pk_afectada?.toString().includes(searchLower)
        );
      });
    }

    if (filtroAccion !== "TODAS") {
      filtered = filtered.filter((r) => r.accion === filtroAccion);
    }

    if (filtroTabla !== "TODAS") {
      filtered = filtered.filter((r) => r.tabla_afectada === filtroTabla);
    }

    if (filtroUsuario !== "TODOS") {
      filtered = filtered.filter((r) => r.usuario === filtroUsuario);
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === 'fecha_hora') {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [registros, searchTerm, filtroAccion, filtroTabla, filtroUsuario, sortConfig]);

  const opcionesAccion = useMemo(() => {
    const acciones = [...new Set(registros.map((r) => r.accion).filter(Boolean))];
    return acciones.sort();
  }, [registros]);

  const opcionesTabla = useMemo(() => {
    const tablas = [...new Set(registros.map((r) => r.tabla_afectada).filter(Boolean))];
    return tablas.sort();
  }, [registros]);

  const opcionesUsuario = useMemo(() => {
    const usuarios = [...new Set(registros.map((r) => r.usuario).filter(Boolean))];
    return usuarios.sort();
  }, [registros]);

  const estadisticas = useMemo(() => {
    return {
      total: registros.length,
      creates: registros.filter(r => r.accion === 'CREATE').length,
      updates: registros.filter(r => r.accion === 'UPDATE').length,
      deletes: registros.filter(r => r.accion === 'DELETE').length,
      reads: registros.filter(r => r.accion === 'READ').length,
      tablas: new Set(registros.map(r => r.tabla_afectada).filter(Boolean)).size,
      usuarios: new Set(registros.map(r => r.usuario).filter(Boolean)).size,
    };
  }, [registros]);

  const totalPages = Math.ceil(registrosFiltrados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRegistros = registrosFiltrados.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filtroAccion, filtroTabla, filtroUsuario]);

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const limpiarFiltros = () => {
    setSearchTerm("");
    setFiltroAccion("TODAS");
    setFiltroTabla("TODAS");
    setFiltroUsuario("TODOS");
    setSortConfig({ key: 'id_evento', direction: 'desc' });
  };

  const exportarCSV = () => {
    const headers = ["ID Evento", "Usuario", "Acción", "Tabla", "PK Afectada", "Fecha/Hora"];
    const csvData = registrosFiltrados.map((r) => [
      r.id_evento,
      r.usuario || "Sin usuario",
      r.accion,
      r.tabla_afectada,
      r.pk_afectada || r.id_registro || "",
      new Date(r.fecha_hora).toLocaleString("es-ES"),
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `auditoria_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const recargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.get("/auditoria/");
      setRegistros(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("[v0] Error al recargar datos:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verDetalles = (registro) => {
    setSelectedRegistro(registro);
    setShowModal(true);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    
    return pages;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#08988e] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Cargando auditoría...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-md border border-red-200 p-8 max-w-md">
          <div className="text-center">
            <svg className="w-16 h-16 mx-auto text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Error de conexión</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={recargarDatos}
              className="px-4 py-2 bg-[#08988e] text-white rounded-lg hover:bg-[#067268] transition"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-1">

      {/* 🟩 CONTENEDOR BLANCO QUE SOLICITASTE */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-10">
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-[#08988e]">Historial de Auditoría</h1>
              <p className="text-gray-600 mt-1">
                Consulta todos los eventos registrados en el sistema
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={recargarDatos}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                title="Recargar datos"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Recargar
              </button>
              <button
                onClick={exportarCSV}
                disabled={registrosFiltrados.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-[#08988e] text-white rounded-lg hover:bg-[#067268] transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Exportar CSV
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
            <p className="text-xs text-blue-600 font-medium uppercase mb-1">Total</p>
            <p className="text-2xl font-bold text-blue-700">{estadisticas.total}</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-xl border border-emerald-200">
            <p className="text-xs text-emerald-600 font-medium uppercase mb-1">Creados</p>
            <p className="text-2xl font-bold text-emerald-700">{estadisticas.creates}</p>
          </div>
          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-4 rounded-xl border border-cyan-200">
            <p className="text-xs text-cyan-600 font-medium uppercase mb-1">Actualizados</p>
            <p className="text-2xl font-bold text-cyan-700">{estadisticas.updates}</p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
            <p className="text-xs text-red-600 font-medium uppercase mb-1">Eliminados</p>
            <p className="text-2xl font-bold text-red-700">{estadisticas.deletes}</p>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
            <p className="text-xs text-gray-600 font-medium uppercase mb-1">Lecturas</p>
            <p className="text-2xl font-bold text-gray-700">{estadisticas.reads}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
            <p className="text-xs text-purple-600 font-medium uppercase mb-1">Tablas</p>
            <p className="text-2xl font-bold text-purple-700">{estadisticas.tablas}</p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200">
            <p className="text-xs text-amber-600 font-medium uppercase mb-1">Usuarios</p>
            <p className="text-2xl font-bold text-amber-700">{estadisticas.usuarios}</p>
          </div>
        </div>

        <div className="mb-6 space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por ID, usuario, acción, tabla o ID afectado..."
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={filtroAccion}
              onChange={(e) => setFiltroAccion(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#08988e] bg-white text-sm"
            >
              <option value="TODAS">Todas las acciones</option>
              {opcionesAccion.map((accion) => (
                <option key={accion} value={accion}>
                  {accion}
                </option>
              ))}
            </select>

            <select
              value={filtroTabla}
              onChange={(e) => setFiltroTabla(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#08988e] bg-white text-sm"
            >
              <option value="TODAS">Todas las tablas</option>
              {opcionesTabla.map((tabla) => (
                <option key={tabla} value={tabla}>
                  {tabla}
                </option>
              ))}
            </select>

            <select
              value={filtroUsuario}
              onChange={(e) => setFiltroUsuario(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#08988e] bg-white text-sm"
            >
              <option value="TODOS">Todos los usuarios</option>
              {opcionesUsuario.map((usuario) => (
                <option key={usuario} value={usuario}>
                  {usuario}
                </option>
              ))}
            </select>

            {(searchTerm || filtroAccion !== "TODAS" || filtroTabla !== "TODAS" || filtroUsuario !== "TODOS") && (
              <button
                onClick={limpiarFiltros}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Limpiar filtros
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div className="text-sm text-gray-600">
            Mostrando <span className="font-semibold text-[#08988e]">{startIndex + 1}</span> a{" "}
            <span className="font-semibold text-[#08988e]">{Math.min(endIndex, registrosFiltrados.length)}</span> de{" "}
            <span className="font-semibold text-[#08988e]">{registrosFiltrados.length}</span> registros
            {registrosFiltrados.length !== registros.length && (
              <span className="text-gray-500"> (filtrado de {registros.length} total)</span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <label htmlFor="itemsPerPage" className="text-sm text-gray-600">
              Mostrar:
            </label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#08988e] bg-white"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-gray-600">por página</span>
          </div>
        </div>

        <div className="bg-white shadow-md border border-gray-200 rounded-xl overflow-hidden">
          {registrosFiltrados.length === 0 ? (
            <div className="p-8 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-600 text-lg">
                {registros.length === 0 ? "No hay registros de auditoría." : "No se encontraron registros con los filtros aplicados."}
              </p>
              {registros.length > 0 && (
                <button
                  onClick={limpiarFiltros}
                  className="mt-4 px-4 py-2 bg-[#08988e] text-white rounded-lg hover:bg-[#067268] transition"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-[#08988e] text-white text-sm uppercase">
                    <th 
                      className="px-6 py-3 text-left cursor-pointer hover:bg-[#067268] transition"
                      onClick={() => handleSort('id_evento')}
                    >
                      <div className="flex items-center gap-2">
                        ID
                        {sortConfig.key === 'id_evento' && (
                          <svg className={`w-4 h-4 transition-transform ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left cursor-pointer hover:bg-[#067268] transition"
                      onClick={() => handleSort('usuario')}
                    >
                      <div className="flex items-center gap-2">
                        Usuario
                        {sortConfig.key === 'usuario' && (
                          <svg className={`w-4 h-4 transition-transform ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left cursor-pointer hover:bg-[#067268] transition"
                      onClick={() => handleSort('accion')}
                    >
                      <div className="flex items-center gap-2">
                        Acción
                        {sortConfig.key === 'accion' && (
                          <svg className={`w-4 h-4 transition-transform ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left cursor-pointer hover:bg-[#067268] transition"
                      onClick={() => handleSort('tabla_afectada')}
                    >
                      <div className="flex items-center gap-2">
                        Tabla
                        {sortConfig.key === 'tabla_afectada' && (
                          <svg className={`w-4 h-4 transition-transform ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left">PK Afectada</th>
                    <th 
                      className="px-6 py-3 text-left cursor-pointer hover:bg-[#067268] transition"
                      onClick={() => handleSort('fecha_hora')}
                    >
                      <div className="flex items-center gap-2">
                        Fecha / Hora
                        {sortConfig.key === 'fecha_hora' && (
                          <svg className={`w-4 h-4 transition-transform ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-center">Acciones</th>
                  </tr>
                </thead>

                <tbody className="text-sm">
                  {currentRegistros.map((r, idx) => (
                    <tr
                      key={r.id_evento}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition ${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                      }`}
                    >
                      <td className="px-6 py-3 font-medium text-gray-700">
                        #{r.id_evento}
                      </td>

                      <td className="px-6 py-3 text-gray-700">
                        <span className="bg-blue-50 px-3 py-1 rounded-full text-blue-700 text-xs font-medium">
                          {r.usuario || "Sin usuario"}
                        </span>
                      </td>

                      <td className="px-6 py-3">
                        <span
                          className={`${getColorAccion(
                            r.accion
                          )} px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit`}
                        >
                          {getIconoAccion(r.accion)} {r.accion}
                        </span>
                      </td>

                      <td className="px-6 py-3 font-semibold text-gray-700">
                        {r.tabla_afectada}
                      </td>

                      <td className="px-6 py-3 text-gray-600 font-mono">
                        {r.pk_afectada || r.id_registro || "-"}
                      </td>

                      <td className="px-6 py-3 text-gray-600 whitespace-nowrap">
                        {new Date(r.fecha_hora).toLocaleString("es-ES", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </td>

                      <td className="px-6 py-3 text-center">
                        <button
                          onClick={() => verDetalles(r)}
                          className="text-[#08988e] hover:text-[#067268] font-medium text-xs"
                          title="Ver detalles"
                        >
                          <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {registrosFiltrados.length > 0 && totalPages > 1 && (
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              Página <span className="font-semibold text-[#08988e]">{currentPage}</span> de{" "}
              <span className="font-semibold text-[#08988e]">{totalPages}</span>
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
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
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
                {getPageNumbers().map((page, idx) => (
                  page === "..." ? (
                    <span key={`ellipsis-${idx}`} className="px-3 py-2 text-gray-500">
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
                  )
                ))}
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
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {showModal && selectedRegistro && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#08988e] text-white px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Detalles del Evento #{selectedRegistro.id_evento}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:text-gray-200 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">ID Evento</p>
                  <p className="font-semibold text-gray-800">#{selectedRegistro.id_evento}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Usuario</p>
                  <p className="font-semibold text-gray-800">{selectedRegistro.usuario || "Sin usuario"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Acción</p>
                  <span className={`${getColorAccion(selectedRegistro.accion)} px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1`}>
                    {getIconoAccion(selectedRegistro.accion)} {selectedRegistro.accion}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Tabla Afectada</p>
                  <p className="font-semibold text-gray-800">{selectedRegistro.tabla_afectada}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">PK Afectada</p>
                  <p className="font-mono text-gray-800">{selectedRegistro.pk_afectada || selectedRegistro.id_registro || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Fecha y Hora</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(selectedRegistro.fecha_hora).toLocaleString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              {selectedRegistro.valores_antes && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2 font-semibold">Valores Antes</p>
                  <pre className="bg-gray-50 p-4 rounded-lg text-xs overflow-x-auto border border-gray-200">
                    {JSON.stringify(selectedRegistro.valores_antes, null, 2)}
                  </pre>
                </div>
              )}

              {selectedRegistro.valores_despues && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2 font-semibold">Valores Después</p>
                  <pre className="bg-gray-50 p-4 rounded-lg text-xs overflow-x-auto border border-gray-200">
                    {JSON.stringify(selectedRegistro.valores_despues, null, 2)}
                  </pre>
                </div>
              )}

              {selectedRegistro.hash_evento && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2 font-semibold">Hash del Evento</p>
                  <p className="bg-gray-50 p-3 rounded-lg text-xs font-mono break-all border border-gray-200">
                    {selectedRegistro.hash_evento}
                  </p>
                </div>
              )}

              {selectedRegistro.hash_anterior && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2 font-semibold">Hash Anterior</p>
                  <p className="bg-gray-50 p-3 rounded-lg text-xs font-mono break-all border border-gray-200">
                    {selectedRegistro.hash_anterior}
                  </p>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200">
              <button
                onClick={() => setShowModal(false)}
                className="w-full px-4 py-2 bg-[#08988e] text-white rounded-lg hover:bg-[#067268] transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

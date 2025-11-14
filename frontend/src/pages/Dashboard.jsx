import { useEffect, useState } from "react"
import {
  FaUserInjured,
  FaClipboardList,
  FaBoxes,
  FaArrowUp,
  FaArrowDown
} from "react-icons/fa"
import { getDashboardData } from "../api/dashboardApi"

/* -----------------------------------------------------------
   🔹 Tarjeta de métrica moderna
----------------------------------------------------------- */
const MetricCard = ({ icon, label, value, trend, color }) => {
  const isPositive = trend >= 0

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${color} 
      p-8 text-white shadow-lg hover:shadow-2xl transition-all duration-300 
      transform hover:scale-105`}
    >
      {/* Marca de agua */}
      <div className="absolute top-0 right-0 opacity-10 text-7xl">{icon}</div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium opacity-90">{label}</p>

          <div
            className={`flex items-center gap-1 text-xs font-semibold 
            ${isPositive ? "text-green-300" : "text-red-300"}`}
          >
            {isPositive ? <FaArrowUp size={12} /> : <FaArrowDown size={12} />}
            {Math.abs(trend)}%
          </div>
        </div>

        <p className="text-4xl font-bold">{value}</p>
      </div>
    </div>
  )
}

/* -----------------------------------------------------------
   🔹 Dashboard
----------------------------------------------------------- */
const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [apiStats, setApiStats] = useState([])
  const [error, setError] = useState(false)

  const detectIcon = (title) => {
    const t = title.toLowerCase()
    if (t.includes("item")) return <FaBoxes className="text-6xl" />
    if (t.includes("lote")) return <FaClipboardList className="text-6xl" />
    if (t.includes("usuario")) return <FaUserInjured className="text-6xl" />
    if (t.includes("entrada")) return <FaClipboardList className="text-6xl" />
    if (t.includes("auditor")) return <FaClipboardList className="text-6xl" />
    return <FaClipboardList className="text-6xl" />
  }

  const colors = [
    "from-teal-500 to-teal-600",
    "from-cyan-500 to-cyan-600",
    "from-emerald-500 to-emerald-600",
    "from-indigo-500 to-indigo-600",
    "from-blue-500 to-blue-600",
    "from-rose-500 to-rose-600",
  ]

  useEffect(() => {
    const loadAll = async () => {
      try {
        const roles = ["auxiliar", "regente", "auditor", "proveedor"]
        const results = await Promise.all(roles.map((r) => getDashboardData(r)))

        const merged = results.flat().map((m) => ({
          metrica: m.metrica,
          valor: m.valor,
        }))

        setApiStats(merged)
      } catch (e) {
        console.error("Error cargando dashboard:", e)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    loadAll()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-1">

      {/* 🟩 CONTENEDOR BLANCO QUE SOLICITASTE */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-10">

        {/* Encabezado */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Panel de Control</h1>
          <p className="text-gray-600">
            Bienvenido. Aquí puedes visualizar estadísticas en tiempo real.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded-lg text-red-700 animate-pulse">
            No se pudieron cargar los datos del dashboard.
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mb-6 p-4 bg-blue-100 border border-blue-400 rounded-lg text-blue-700 flex items-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-700"></div>
            Cargando datos...
          </div>
        )}

        {/* Métricas dinámicas */}
        {!loading && apiStats.length > 0 && (
          <>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {apiStats.map((item, index) => (
                <div
                  key={index}
                  className="transition-all duration-500"
                  style={{
                    animation: `fadeUp 0.6s ease-out ${index * 100}ms forwards`,
                    opacity: 0,
                  }}
                >
                  <style>{`
                    @keyframes fadeUp {
                      from { opacity: 0; transform: translateY(20px); }
                      to { opacity: 1; transform: translateY(0); }
                    }
                  `}</style>

                  <MetricCard
                    icon={detectIcon(item.metrica)}
                    label={item.metrica}
                    value={item.valor}
                    trend={Math.floor(Math.random() * 30) - 10}
                    color={colors[index % colors.length]}
                  />
                </div>
              ))}
            </div>

            {/* Resumen inferior */}
            <div className="mt-10 p-6 bg-white rounded-2xl shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumen del Sistema</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-teal-50 rounded-lg border border-teal-100">
                  <p className="text-sm text-gray-600 mb-1">Total de métricas</p>
                  <p className="text-3xl font-bold text-teal-600">{apiStats.length}</p>
                </div>

                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                  <p className="text-sm text-gray-600 mb-1">Estado</p>
                  <p className="text-3xl font-bold text-emerald-600">Activo</p>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-sm text-gray-600 mb-1">Última actualización</p>
                  <p className="text-sm font-semibold text-blue-600">Hace 2 min</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {/* FIN DEL CONTENEDOR BLANCO */}

    </div>
  )
}

export default Dashboard

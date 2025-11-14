"use client"

import { useState } from "react"
import { FaClinicMedical, FaUser, FaLock, FaSignInAlt, FaEye, FaEyeSlash } from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom"

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const validateForm = () => {
    const newErrors = {}
    if (!formData.username.trim()) newErrors.username = "El usuario es requerido"
    if (!formData.password) newErrors.password = "La contraseña es requerida"
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: formData.username || "Usuario Demo",
          role: "Administrador",
        }),
      )
      navigate("/dashboard")
    }, 1000)
  }

  return (
    <div className="flex min-h-screen font-sans bg-gray-50">
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-[#08988e] via-[#067a73] to-[#055a50] flex-col justify-center items-center text-white p-10 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"></div>

        <div className="relative z-10 text-center">
          <div className="mb-6 animate-bounce">
            <FaClinicMedical className="text-7xl mx-auto text-white drop-shadow-lg" />
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-3">FarmaGestión</h1>
          <p className="mt-4 text-lg opacity-90 leading-relaxed">Sistema Integral de Gestión Farmacéutica</p>
          <p className="mt-3 text-sm opacity-75">Eficiencia, seguridad y control en tus manos</p>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-4 py-10 md:py-0">
        <div className="w-full max-w-md">
          {/* Mobile header */}
          <div className="md:hidden mb-8 text-center">
            <FaClinicMedical className="text-5xl mx-auto text-[#08988e] mb-3" />
            <h1 className="text-3xl font-bold text-gray-800">FarmaGestión</h1>
          </div>

          {/* Login card */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <h2 className="text-[#08988e] text-2xl font-bold mb-2 flex items-center">
              <div className="w-10 h-10 bg-[#08988e] rounded-lg flex items-center justify-center mr-3">
                <FaSignInAlt className="text-white text-lg" />
              </div>
              Iniciar Sesión
            </h2>
            <p className="text-gray-500 text-sm mb-6">Accede a tu cuenta de administrador</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username field */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#08988e] opacity-60" />
                  <input
                    type="text"
                    name="username"
                    placeholder="Ingresa tu usuario"
                    value={formData.username}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#08988e] focus:border-transparent transition ${
                      errors.username ? "border-red-400 bg-red-50" : "border-gray-200 hover:border-gray-300"
                    }`}
                  />
                </div>
                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
              </div>

              {/* Password field */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#08988e] opacity-60" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Ingresa tu contraseña"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-12 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#08988e] focus:border-transparent transition ${
                      errors.password ? "border-red-400 bg-red-50" : "border-gray-200 hover:border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#08988e] to-[#067a73] text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:from-[#067a73] hover:to-[#055a50] transition duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-6"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Verificando...
                  </>
                ) : (
                  <>
                    <FaSignInAlt />
                    Ingresar
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <Link
                to="/recuperar-contrasena"
                className="text-[#08988e] hover:text-[#067a73] text-sm font-medium transition flex items-center justify-center gap-1"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-gray-500 text-xs mt-6">© 2025 FarmaGestión. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  )
}

export default Login

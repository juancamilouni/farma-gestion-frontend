import React from "react";
import { FaUserInjured, FaPills, FaClipboardList, FaBoxes } from "react-icons/fa";

const Dashboard = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-[#08988e] mb-4">
        Dashboard Principal
      </h1>
      <p className="text-gray-600 mb-8">
        Bienvenido a FarmaGestión. Aquí podrás ver un resumen general del sistema y tus estadísticas.
      </p>

      {/* 🔹 Estadísticas rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-gray-50 rounded-lg shadow-sm p-6 text-center">
          <FaUserInjured className="text-3xl text-[#08988e] mx-auto mb-2" />
          <p className="font-semibold text-lg">Pacientes</p>
          <p className="text-gray-500">128</p>
        </div>

        <div className="bg-gray-50 rounded-lg shadow-sm p-6 text-center">
          <FaPills className="text-3xl text-[#08988e] mx-auto mb-2" />
          <p className="font-semibold text-lg">Medicamentos</p>
          <p className="text-gray-500">243</p>
        </div>

        <div className="bg-gray-50 rounded-lg shadow-sm p-6 text-center">
          <FaClipboardList className="text-3xl text-[#08988e] mx-auto mb-2" />
          <p className="font-semibold text-lg">Órdenes</p>
          <p className="text-gray-500">67</p>
        </div>

        <div className="bg-gray-50 rounded-lg shadow-sm p-6 text-center">
          <FaBoxes className="text-3xl text-[#08988e] mx-auto mb-2" />
          <p className="font-semibold text-lg">Inventario</p>
          <p className="text-gray-500">5 alertas</p>
        </div>
      </div>

      {/* 🔹 Placeholder para próximos módulos */}
      <section className="text-center text-gray-500 italic border-t pt-6">
        <p>📊 Gráfico de órdenes mensuales (próximamente)</p>
        <p className="mt-2">🧩 Estado de órdenes (próximamente)</p>
      </section>
    </div>
  );
};

export default Dashboard;

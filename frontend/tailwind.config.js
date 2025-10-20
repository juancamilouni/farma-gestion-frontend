/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#08988e",   // Verde menta FarmaGestión
        secondary: "#067a73", // Tono más oscuro
      },
    },
  },
  plugins: [],
};

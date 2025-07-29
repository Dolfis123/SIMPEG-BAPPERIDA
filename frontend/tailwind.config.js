/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    // Pastikan path ini benar untuk struktur src/pages/ dan src/components/
    "./src/**/*.{js,jsx,ts,tsx}", 
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,jsx,ts,tsx,mdx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        labrada: ["Labrada","monospace", "serif"]
      }
    },
  },
  important: "#app",
  plugins: [],
  corePlugins: {
    preflight: false,
  }
}
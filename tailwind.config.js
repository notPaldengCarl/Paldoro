/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", 
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'pv-white': '#F7F8FA',
        'pv-silver': '#E6EDF6',
        'pv-blue': '#0F66FF',
        'pv-ice': '#EAF6FF',
      },
      fontFamily: {
        sans: ['"General Sans"', 'Inter', 'system-ui', 'sans-serif'],
        zentry: ['"Zentry"', 'sans-serif']
      },
      boxShadow: {
        'soft-lg': '0 10px 35px rgba(8,18,30,0.18)',
        'glow': '0 10px 40px rgba(15,102,255,0.12)'
      }
    }
  },
  plugins: []
}

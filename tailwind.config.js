/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f8ff',
          100: '#e0e9ff',
          200: '#c7d7fe',
          300: '#a5bdfc',
          400: '#8098f9',
          500: '#6070f2',
          600: '#4b4de6',
          700: '#3e3ccf',
          800: '#3335a8',
          900: '#2e3382',
        },
        secondary: {
          50: '#f2f8f9',
          100: '#e6f1f5',
          200: '#c2e1e8',
          300: '#9ccfd8',
          400: '#75bac7',
          500: '#569faa',
          600: '#41818f',
          700: '#366a75',
          800: '#305762',
          900: '#284a54',
        },
      },
    },
  },
  plugins: [],
} 
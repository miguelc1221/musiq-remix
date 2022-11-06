/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      colors: {
        primaryBlue: '#1E88E5',
        secondaryBlue: '#42A5F5'
      }
    },
  },
  plugins: [],
};
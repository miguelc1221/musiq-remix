/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      colors: {
        primaryColor: '#f94c57',
        secondaryColor: '#fc3c44',
      }
    },
  },
  plugins: [],
};
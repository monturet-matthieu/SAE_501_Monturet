/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      'open': 'Open Sans, sans-serif',
    },
    extend: {
      backgroundImage: {
        'signup-bg': "url('/bg-inscription.webp')",
        'login-bg': "url('/bg-connexion.webp')"
      }
    },
  },
  plugins: [],
}